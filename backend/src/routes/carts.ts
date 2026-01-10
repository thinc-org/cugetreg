import { prisma } from "../db/clients.js";
import { Effect, Console } from "effect";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  addCourseRoute,
  createCartRoute,
  deleteCartRoute,
  deleteCourseRoute,
  getCartDetailRoute,
  listCartsRoute,
  updateCartRoute,
  updateCourseRoute,
} from "../routes_define/carts.routes.js";
import type {
  CartItemDetail,
  ClassConflict,
  ClassScheduleItem,
  ExamConflict,
  ExamScheduleItem,
} from "../zod_schemas/carts.response.schema.js";
import dayjs from "dayjs";
import type { Variables } from "../lib/auth.js";
import { LexoRankService } from "../services/lexorank.service.js";

const carts = new OpenAPIHono<{ Variables: Variables }>()

  // Manage Timetable

  // 3.1. List timetables for current user
  .openapi(listCartsRoute, async (c) => {
    const payload = c.get("user");
    const userId = payload.id;
    const { academicYear, semester, studyProgram } = c.req.valid("query");

    const program = Effect.gen(function* () {
      const userCarts = yield* Effect.tryPromise({
        try: () =>
          prisma.cart.findMany({
            where: {
              userId,
              academicYear,
              semester,
              studyProgram,
            },
          }),
        catch: (error) => new Error(`Prisma Error: ${error}`),
      });
      return c.json({ data: userCarts }, 200);
    }).pipe(
      Effect.catchAll((err) => {
        return Effect.gen(function* () {
          yield* Console.error("Fetch Carts Error:", err);
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        });
      })
    );
    return await Effect.runPromise(program);
  })

  // 3.2. Create new timetable (cart)
  .openapi(createCartRoute, async (c) => {
    const payload = c.get("user");
    const userId = payload.id;
    const validatedData = c.req.valid("json");
    const program = Effect.gen(function* () {
      // Sequence of dependent operation
      const newCart = yield* Effect.tryPromise({
        try: () =>
          prisma.$transaction(async (tx) => {
            // Set other isDefault
            if (validatedData.isDefault) {
              await tx.cart.updateMany({
                where: {
                  userId: userId,
                  isDefault: true,
                },
                data: { isDefault: false },
              });
            }

            const lastCart = await tx.cart.findFirst({
              where: {
                userId,
                academicYear: validatedData.academicYear,
                semester: validatedData.semester,
                studyProgram: validatedData.studyProgram,
              },
              orderBy: { cartOrder: "desc" },
            });

            const nextCartOrder = LexoRankService.getNextRank(
              lastCart?.cartOrder
            );

            return await tx.cart.create({
              data: {
                userId,
                cartOrder: nextCartOrder,
                ...validatedData,
              },
            });
          }),
        catch: (err) => err,
      });

      return c.json({ data: newCart }, 201);
    }).pipe(
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* Console.error("Fetch Carts Error:", err);
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        })
      )
    );
    return await Effect.runPromise(program);
  })

  // 3.3. Edit timetable (cart) (Rename, Set default, share/stop share, Ordering)
  .openapi(updateCartRoute, async (c) => {
    const payload = c.get("user");
    const userId = payload.id;
    const cartId = c.req.param("cartId");
    const updatedData = c.req.valid("json");

    const program = Effect.gen(function* () {
      const updatedCart = yield* Effect.tryPromise({
        try: () =>
          prisma.$transaction(async (tx) => {
            // Find current cart
            const targetCart = await tx.cart.findFirst({
              where: { id: cartId },
            });

            if (!targetCart) {
              throw new Error("CART_NOT_FOUND");
            }
            if (targetCart.userId !== userId) throw new Error("NOT_CART_OWNER");

            // Set other isDefault
            if (updatedData.isDefault === true) {
              await tx.cart.updateMany({
                where: {
                  userId,
                  isDefault: true,
                },
                data: { isDefault: false },
              });
            }

            // Reorder other cartOrder -> Please review this code!
            const { prevId, nextId, ...dataToUpdate } = updatedData as any;

            if (prevId !== undefined || nextId !== undefined) {
              const [prevCart, nextCart] = await Promise.all([
                prevId ? tx.cart.findUnique({ where: { id: prevId } }) : null,
                nextId ? tx.cart.findUnique({ where: { id: nextId } }) : null,
              ]);

              dataToUpdate.cartOrder = LexoRankService.getBetweenRank(
                prevCart?.cartOrder,
                nextCart?.cartOrder
              );
            }

            return await tx.cart.update({
              where: { id: cartId },
              data: dataToUpdate,
            });
          }),
        catch: (err) => err as Error,
      });
      return c.json({ data: updatedCart }, 200);
    }).pipe(
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* Console.error("Fetch Carts Error:", err);

          if (err.message === "CART_NOT_FOUND") {
            return c.json({ error: "CART_NOT_FOUND" }, 404);
          }
          if (err.message === "NOT_CART_OWNER") {
            return c.json({ error: "NOT_CART_OWNER" }, 403);
          }

          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        })
      )
    );

    return await Effect.runPromise(program);
  })

  // 3.4. Delete timetable (cart)
  .openapi(deleteCartRoute, async (c) => {
    const userId = c.get("user").id;
    const cartId = c.req.param("cartId");

    const program = Effect.gen(function* () {
      yield* Effect.tryPromise({
        try: () =>
          prisma.$transaction(async (tx) => {
            const targetCart = await tx.cart.findUnique({
              where: { id: cartId },
            });
            if (!targetCart) throw new Error("CART_NOT_FOUND");
            if (targetCart.userId !== userId) throw new Error("NOT_CART_OWNER");

            await tx.cart.delete({
              where: { id: cartId },
            });

            // Case deletedCart is default assign least cartOrder to be next default
            if (targetCart.isDefault) {
              const nextDefaultCart = await tx.cart.findFirst({
                where: {
                  userId,
                },
                orderBy: { cartOrder: "asc" },
              });
              if (nextDefaultCart) {
                await tx.cart.update({
                  where: { id: nextDefaultCart.id },
                  data: { isDefault: true },
                });
              }
            }
          }),
        catch: (err) => err as Error,
      });
      return c.body(null, 204);
    }).pipe(
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* Console.error("Fetch Carts Error:", err);

          if (err.message === "CART_NOT_FOUND") {
            return c.json({ error: "CART_NOT_FOUND" }, 404);
          }
          if (err.message === "NOT_CART_OWNER") {
            return c.json({ error: "NOT_CART_OWNER" }, 403);
          }

          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        })
      )
    );

    return await Effect.runPromise(program);
  })

  // 3.5. Get timetable details (courses, credits, ect.)
  .openapi(getCartDetailRoute, async (c) => {
    const userId = c.get("user").id;
    const cartId = c.req.param("cartId");

    const program = Effect.gen(function* () {
      const cart = yield* Effect.tryPromise({
        try: () =>
          prisma.cart.findUnique({
            where: { id: cartId },
            include: {
              items: {
                include: {
                  courseInfo: {
                    include: {
                      courses: {
                        include: {
                          sections: {
                            include: { classes: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          }),
        catch: (error) => error as Error,
      });

      if (!cart) {
        return yield* Effect.fail(new Error("CART_NOT_FOUND"));
      }
      if (cart.userId !== userId) {
        return yield* Effect.fail(new Error("NOT_CART_OWNER"));
      }

      const itemsResponse: CartItemDetail[] = [];
      const classesSchedule: ClassScheduleItem[] = [];
      const examsSchedule: ExamScheduleItem[] = [];

      let totalCredits = 0;
      let totalVisibleCredits = 0;
      let totalGradedCredits = 0;
      let totalPoints = 0;

      cart.items.forEach((item) => {
        const info = item.courseInfo;
        const creditValue = Number(info.credit);

        const courseData = info.courses.find(
          // info.courses is Array of Course
          (course) =>
            course.academicYear === cart.academicYear &&
            course.semester === cart.semester &&
            course.studyProgram === cart.studyProgram
        );

        const sectionData = courseData?.sections.find(
          // courseData.sections is Array of Section
          (sec) => sec.sectionNo === item.sectionNo
        ); // Section Object of this item

        // Calculate Pre-Summary
        totalCredits += creditValue;
        if (!item.hidden) totalVisibleCredits += creditValue;
        if (item.isGraded) {
          totalGradedCredits += creditValue;
          totalPoints += Number(item.expectedGrade) * creditValue;
        }

        // Format Items
        itemsResponse.push({
          id: item.id,
          courseNo: item.courseNo,
          sectionNo: item.sectionNo,
          color: item.color,
          hidden: item.hidden,
          cartOrder: item.cartOrder,
          isGraded: item.isGraded,
          expectedGrade: item.expectedGrade.toString(),
          course: {
            courseNameTh: info.courseNameTh,
            courseNameEn: info.courseNameEn,
            credit: info.credit.toString(),
          },
          section: sectionData
            ? {
                closed: sectionData.closed,
                regis: sectionData.regis,
                max: sectionData.max,
                note: sectionData.note,
              }
            : null,
        });

        // Format Classes Schedule
        sectionData?.classes.forEach((cls) => {
          classesSchedule.push({
            cartItemId: item.id,
            courseNo: item.courseNo,
            sectionNo: item.sectionNo,
            type: cls.type,
            dayOfWeek: cls.dayOfWeek,
            periodStart: cls.periodStart,
            periodEnd: cls.periodEnd,
            building: cls.building,
            room: cls.room,
            professors: cls.professors,
          });
        });

        // Format Exams Schedule (Midterm/Final)
        if (courseData?.midtermStart && courseData.midtermEnd) {
          examsSchedule.push({
            cartItemId: item.id,
            courseNo: item.courseNo,
            type: "MIDTERM",
            start: courseData.midtermStart.toISOString(),
            end: courseData.midtermEnd.toISOString(),
          });
        }
        if (courseData?.finalStart && courseData.finalEnd) {
          examsSchedule.push({
            cartItemId: item.id,
            courseNo: item.courseNo,
            type: "FINAL",
            start: courseData.finalStart.toISOString(),
            end: courseData.finalEnd?.toISOString(),
          });
        }
      });

      // Find class conflict
      const classConflicts: ClassConflict[] = [];
      for (let i = 0; i < classesSchedule.length; i++) {
        for (let j = i + 1; j < classesSchedule.length; j++) {
          const a = classesSchedule[i];
          const b = classesSchedule[j];

          if (a.dayOfWeek === b.dayOfWeek) {
            const startA = dayjs(`2000-01-01T${a.periodStart}`);
            const endA = dayjs(`2000-01-01T${a.periodEnd}`);
            const startB = dayjs(`2000-01-01T${b.periodStart}`);
            const endB = dayjs(`2000-01-01T${b.periodEnd}`);

            if (startA.isBefore(endB) && startB.isBefore(endA)) {
              classConflicts.push({
                type: "TIME_OVERLAP",
                itemIds: [a.cartItemId, b.cartItemId],
                dayOfWeek: a.dayOfWeek,
                periodStart: a.periodStart,
                periodEnd: a.periodEnd,
              });
            }
          }
        }
      }

      // Find Exam Conflicts -> Please review this logic
      const examConflicts: ExamConflict[] = [];
      for (let i = 0; i < examsSchedule.length; i++) {
        for (let j = i + 1; j < examsSchedule.length; j++) {
          const examA = examsSchedule[i];
          const examB = examsSchedule[j];

          const startA = dayjs(examA.start);
          const endA = dayjs(examA.end);
          const startB = dayjs(examB.start);
          const endB = dayjs(examB.end);

          if (startA.isBefore(endB) && startB.isBefore(endA)) {
            examConflicts.push({
              type: "EXAM_OVERLAP",
              itemIds: [examA.cartItemId, examB.cartItemId],
              start: startA.isAfter(startB) ? examA.start : examB.start,
              end: endA.isBefore(endB) ? examA.end : examB.end,
            });
          }
        }
      }

      return c.json(
        {
          data: {
            cart: {
              id: cart.id,
              name: cart.name,
              studyProgram: cart.studyProgram,
              academicYear: cart.academicYear,
              semester: cart.semester,
              visible: (cart.visible === "PUBLIC" ? "PUB" : "PVT") as
                | "PUB"
                | "PVT",
              isDefault: cart.isDefault,
              cartOrder: cart.cartOrder,
              items: itemsResponse,
            },
            summary: {
              totalCredits: totalCredits.toFixed(1),
              totalVisibleCredits: totalVisibleCredits.toFixed(1),
              totalGradedCredits: totalGradedCredits.toFixed(1),
              expectedGPA:
                totalGradedCredits > 0
                  ? Number((totalPoints / totalGradedCredits).toFixed(2))
                  : 0,
            },
            conflicts: {
              classConflicts,
              examConflicts,
            },
            schedule: {
              classes: classesSchedule,
              exams: examsSchedule,
            },
          },
        },
        200
      );
    }).pipe(
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* Console.error(err);
          if (err.message === "CART_NOT_FOUND")
            return c.json({ error: "CART_NOT_FOUND" }, 404);
          if (err.message === "NOT_CART_OWNER")
            return c.json({ error: "NOT_CART_OWNER" }, 403);
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        })
      )
    );

    return await Effect.runPromise(program);
  })

  // Manange Course in Timetable

  // 3.6. Add course to timetable
  .openapi(addCourseRoute, async (c) => {
    const userId = c.get("user").id;
    const validatedData = c.req.valid("json");
    const cartId = c.req.param("cartId");

    const program = Effect.gen(function* () {
      const newItem = yield* Effect.tryPromise({
        try: () =>
          prisma.$transaction(async (tx) => {
            // Get cart
            const cart = await tx.cart.findUnique({ where: { id: cartId } });
            if (!cart) throw new Error("CART_NOT_FOUND");
            if (cart.userId !== userId) throw new Error("NOT_CART_OWNER");

            // Get Course
            const courseInfo = await tx.courseInfo.findUnique({
              where: { courseNo: validatedData.courseNo },
            });
            if (!courseInfo) throw new Error("COURSE_NOT_FOUND");

            // Get Section
            const section = await tx.section.findFirst({
              where: {
                sectionNo: validatedData.sectionNo,
                course: {
                  courseNo: validatedData.courseNo,
                  semester: cart.semester,
                  academicYear: cart.academicYear,
                  studyProgram: cart.studyProgram,
                },
              },
            });
            if (!section) throw new Error("SECTION_NOT_FOUND");

            const lastItem = await tx.cartItem.findFirst({
              where: { cartId: cartId },
              orderBy: { cartOrder: "desc" },
            });

            const nextOrder = LexoRankService.getNextRank(lastItem?.cartOrder);

            // Add new cartItem
            return await tx.cartItem.create({
              data: {
                cartId: cartId,
                courseNo: validatedData.courseNo,
                sectionNo: validatedData.sectionNo,
                color: validatedData.color || "primary",
                isGraded: validatedData.isGraded,
                expectedGrade: validatedData.expectedGrade,
                hidden: validatedData.hidden,
                cartOrder: nextOrder,
              },
            });
          }),
        catch: (err) => err as Error,
      });

      return c.json({ data: newItem }, 201);
    }).pipe(
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* Console.error(err);

          const errorMap: Record<string, number> = {
            CART_NOT_FOUND: 404,
            NOT_CART_OWNER: 403,
            COURSE_NOT_FOUND: 404,
            SECTION_NOT_FOUND: 404,
          };

          const status = errorMap[err.message] || 500;
          return c.json(
            { error: err.message || "INTERNAL_SERVER_ERROR" },
            status as any
          );
        })
      )
    );

    return await Effect.runPromise(program);
  })

  // 3.7. Update/edit course in timetable
  .openapi(updateCourseRoute, async (c) => {
    const userId = c.get("user").id;
    const itemId = c.req.param("itemId");
    const updatedData = c.req.valid("json");

    const program = Effect.gen(function* () {
      const updatedItem = yield* Effect.tryPromise({
        try: () =>
          prisma.$transaction(async (tx) => {
            const targetItem = await tx.cartItem.findUnique({
              where: { id: itemId },
              include: { cart: true },
            });

            if (!targetItem) throw new Error("ITEM_NOT_FOUND");
            if (targetItem.cart.userId !== userId)
              throw new Error("NOT_CART_OWNER");

            if (
              updatedData.sectionNo !== undefined &&
              updatedData.sectionNo !== targetItem.sectionNo
            ) {
              const section = await tx.section.findFirst({
                where: {
                  sectionNo: updatedData.sectionNo,
                  course: {
                    courseNo: targetItem.courseNo,
                    semester: targetItem.cart.semester,
                    academicYear: targetItem.cart.academicYear,
                    studyProgram: targetItem.cart.studyProgram,
                  },
                },
              });
              if (!section) throw new Error("SECTION_NOT_FOUND");
            }

            // Reorder cartOrder -> please review this logic
            const { prevId, nextId, ...dataToUpdate } = updatedData as any;

            if (prevId !== undefined || nextId !== undefined) {
              const [prevItem, nextItem] = await Promise.all([
                prevId
                  ? tx.cartItem.findUnique({ where: { id: prevId } })
                  : null,
                nextId
                  ? tx.cartItem.findUnique({ where: { id: nextId } })
                  : null,
              ]);

              dataToUpdate.cartOrder = LexoRankService.getBetweenRank(
                prevItem?.cartOrder,
                nextItem?.cartOrder
              );
            }

            return await tx.cartItem.update({
              where: { id: itemId },
              data: dataToUpdate,
            });
          }),
        catch: (err) => err as Error,
      });

      return c.json({ data: updatedItem }, 200);
    }).pipe(
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* Console.error("Update CartItem Error:", err);

          if (err.message === "ITEM_NOT_FOUND")
            return c.json({ error: "ITEM_NOT_FOUND" }, 404);
          if (err.message === "NOT_CART_OWNER")
            return c.json({ error: "NOT_CART_OWNER" }, 403);
          if (err.message === "SECTION_NOT_FOUND")
            return c.json({ error: "SECTION_NOT_FOUND_FOR_SEMESTER" }, 400);

          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        })
      )
    );

    return await Effect.runPromise(program);
  })

  // 3.8. Remove course from timetable
  .openapi(deleteCourseRoute, async (c) => {
    const payload = c.get("user");
    const userId = payload.id;
    const itemId = c.req.param("itemId");

    const program = Effect.gen(function* () {
      yield* Effect.tryPromise({
        try: () =>
          prisma.$transaction(async (tx) => {
            const cartItem = await tx.cartItem.findUnique({
              where: { id: itemId },
              include: { cart: true },
            });

            if (!cartItem) {
              throw new Error("ITEM_NOT_FOUND");
            }

            if (cartItem.cart.userId !== userId) {
              throw new Error("NOT_CART_OWNER");
            }

            await tx.cartItem.delete({
              where: { id: itemId },
            });
          }),
        catch: (err) => err as Error,
      });
      return c.body(null, 204);
    }).pipe(
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* Console.error("Delete CartItem Error:", err);

          if (err.message === "ITEM_NOT_FOUND") {
            return c.json({ error: "ITEM_NOT_FOUND" }, 404);
          }
          if (err.message === "NOT_CART_OWNER") {
            return c.json({ error: "NOT_CART_OWNER" }, 403);
          }

          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        })
      )
    );

    return await Effect.runPromise(program);
  });

export default carts;
