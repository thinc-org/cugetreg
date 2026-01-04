import { Hono } from "hono";
import { prisma } from "../db/clients.js";
import { zValidator } from "@hono/zod-validator";
import {
  AddCourseBodySchema,
  CreateCartBodySchema,
  ListCartsQuerySchema,
  UpdateCartBodySchema,
  UpdateCourseBodySchema,
} from "../zod_schemas/carts.schema.js";
import { Effect, Console } from "effect";

const carts = new Hono();

// Manage Timetable

// 3.1. List timetables for current user
carts.get("/", zValidator("query", ListCartsQuerySchema), async (c) => {
  const payload = c.get("jwtPayload");
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
    return c.json({ data: userCarts });
  }).pipe(
    Effect.catchAll((err) => {
      return Effect.gen(function* () {
        yield* Console.error("Fetch Carts Error:", err);
        return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
      });
    })
  );
  return await Effect.runPromise(program);
});

// 3.2. Create new timetable (cart)
carts.post("/", zValidator("json", CreateCartBodySchema), async (c) => {
  const payload = c.get("jwtPayload");
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
                academicYear: validatedData.academicYear,
                semester: validatedData.semester,
                studyProgram: validatedData.studyProgram,
                isDefault: true,
              },
              data: { isDefault: false },
            });
          }
          // Find max of cart_order
          const aggregate = await tx.cart.aggregate({
            where: {
              userId,
              academicYear: validatedData.academicYear,
              semester: validatedData.semester,
              studyProgram: validatedData.studyProgram,
            },
            _max: { cartOrder: true },
          });
          // When aggregate._max.cartOrder === null , nextCartOrder = 0
          const nextCartOrder = (aggregate._max.cartOrder ?? -1) + 1;

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
});

// 3.3. Edit timetable (cart) (Rename, Set default, share/stop share, Ordering)
carts.patch("/:cartId", zValidator("json", UpdateCartBodySchema), async (c) => {
  const payload = c.get("jwtPayload");
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
                academicYear: targetCart.academicYear,
                semester: targetCart.semester,
                studyProgram: targetCart.studyProgram,
                isDefault: true,
              },
              data: { isDefault: false },
            });
          }

          // Reorder other cartOrder -> Please review this code!
          if (
            updatedData.cartOrder !== undefined &&
            updatedData.cartOrder !== targetCart.cartOrder
          ) {
            const aggregate = await tx.cart.aggregate({
              where: {
                userId,
                academicYear: targetCart.academicYear,
                semester: targetCart.semester,
                studyProgram: targetCart.studyProgram,
              },
              _max: { cartOrder: true },
            });

            const maxOrder = aggregate._max.cartOrder ?? 0;

            let newOrder = Math.max(
              0,
              Math.min(updatedData.cartOrder, maxOrder)
            );
            updatedData.cartOrder = newOrder;

            const oldOrder = targetCart.cartOrder;

            if (newOrder !== oldOrder) {
              const isMoveDown = oldOrder < newOrder;
              await tx.cart.updateMany({
                where: {
                  userId,
                  academicYear: targetCart.academicYear,
                  semester: targetCart.semester,
                  studyProgram: targetCart.studyProgram,
                  cartOrder: isMoveDown
                    ? { gt: oldOrder, lte: newOrder }
                    : { gte: newOrder, lt: oldOrder },
                },
                data: {
                  cartOrder: {
                    [isMoveDown ? "decrement" : "increment"]: 1,
                  },
                },
              });
            }
          }

          return await tx.cart.update({
            where: { id: cartId },
            data: updatedData,
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
});

// 3.4. Delete timetable (cart)
carts.delete("/:cartId", async (c) => {
  const userId = c.get("jwtPayload").id;
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

          // Reorder cartOrder -> Please review this code
          await tx.cart.updateMany({
            where: {
              userId,
              academicYear: targetCart.academicYear,
              semester: targetCart.semester,
              studyProgram: targetCart.studyProgram,
              cartOrder: { gt: targetCart.cartOrder },
            },
            data: {
              cartOrder: { decrement: 1 },
            },
          });

          // Case deletedCart is default assign least cartOrder to be next default
          if (targetCart.isDefault) {
            const nextDefaultCart = await tx.cart.findFirst({
              where: {
                userId,
                academicYear: targetCart.academicYear,
                semester: targetCart.semester,
                studyProgram: targetCart.studyProgram,
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
});

// 3.5. Get timetable details (courses, credits, ect.)
carts.get("/:cartId", async (c) => {
  const userId = c.get("jwtPayload").id;
  const cartId = c.req.param("cartId");

  const program = Effect.gen(function* () {
    const cart = yield* Effect.tryPromise({
      try: () =>
        prisma.cart.findUnique({
          where: { id: cartId },
          include: {
            items: {
              include: {
                courseN: {
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

    const itemsResponse: any[] = [];
    const classesSchedule: any[] = [];
    const examsSchedule: any[] = [];

    let totalCredits = 0;
    let totalVisibleCredits = 0;
    let totalGradedCredits = 0;
    let totalPoints = 0;

    cart.items.forEach((item) => {
      const info = item.courseN;
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
      if (courseData?.midtermStart) {
        examsSchedule.push({
          cartItemId: item.id,
          courseNo: item.courseNo,
          type: "MIDTERM",
          start: courseData.midtermStart.toISOString(),
          end: courseData.midtermEnd?.toISOString(),
        });
      }
      if (courseData?.finalStart) {
        examsSchedule.push({
          cartItemId: item.id,
          courseNo: item.courseNo,
          type: "FINAL",
          start: courseData.finalStart.toISOString(),
          end: courseData.finalEnd?.toISOString(),
        });
      }
    });

    // Find class conflict -> Please review this logic
    // Now O(n^2) improve later
    const classConflicts: any[] = [];
    const timeToMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    for (let i = 0; i < classesSchedule.length; i++) {
      for (let j = i + 1; j < classesSchedule.length; j++) {
        const a = classesSchedule[i];
        const b = classesSchedule[j];
        if (a.dayOfWeek === b.dayOfWeek) {
          const startA = timeToMin(a.periodStart);
          const endA = timeToMin(a.periodEnd);
          const startB = timeToMin(b.periodStart);
          const endB = timeToMin(b.periodEnd);
          if (startA < endB && startB < endA) {
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
    // Now O(n^2) improve later
    const examConflicts: any[] = [];
    for (let i = 0; i < examsSchedule.length; i++) {
      for (let j = i + 1; j < examsSchedule.length; j++) {
        const examA = examsSchedule[i];
        const examB = examsSchedule[j];

        // Garuntee if startA exist then endA exist
        const startA = new Date(examA.start).getTime();
        const endA = new Date(examA.end).getTime();
        const startB = new Date(examB.start).getTime();
        const endB = new Date(examB.end).getTime();

        if (startA < endB && startB < endA) {
          examConflicts.push({
            type: "EXAM_OVERLAP",
            itemIds: [examA.cartItemId, examB.cartItemId],
            start: startA > startB ? examA.start : examB.start,
            end: endA < endB ? examA.end : examB.end,
          });
        }
      }
    }

    return c.json({
      data: {
        cart: {
          id: cart.id,
          name: cart.name,
          studyProgram: cart.studyProgram,
          academicYear: cart.academicYear,
          semester: cart.semester,
          visible: cart.visible === "PUBLIC" ? "PUB" : "PRIV",
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
    });
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
});

// Manange Course in Timetable

// 3.6. Add course to timetable
carts.post(
  "/:cartId/items",
  zValidator("json", AddCourseBodySchema),
  async (c) => {
    const userId = c.get("jwtPayload").id;
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
            console.log(courseInfo);

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

            // Find nextCardItemOrder
            const aggregation = await tx.cartItem.aggregate({
              where: { cartId },
              _max: { cartOrder: true },
            });
            const nextOrder = (aggregation._max.cartOrder ?? -1) + 1;

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
  }
);

// 3.7. Update/edit course in timetable
carts.patch(
  "/:itemId",
  zValidator("json", UpdateCourseBodySchema),
  async (c) => {
    const userId = c.get("jwtPayload").id;
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
            if (
              updatedData.cartOrder !== undefined &&
              updatedData.cartOrder !== targetItem.cartOrder
            ) {
              const aggregate = await tx.cartItem.aggregate({
                where: { cartId: targetItem.cartId },
                _max: { cartOrder: true },
              });

              const maxOrder = aggregate._max.cartOrder ?? 0;

              let newOrder = Math.max(
                0,
                Math.min(updatedData.cartOrder, maxOrder)
              );
              updatedData.cartOrder = newOrder;

              const oldOrder = targetItem.cartOrder;

              if (newOrder !== oldOrder) {
                const isMoveDown = oldOrder < newOrder;
                await tx.cartItem.updateMany({
                  where: {
                    cartId: targetItem.cartId,
                    cartOrder: isMoveDown
                      ? { gt: oldOrder, lte: newOrder }
                      : { gte: newOrder, lt: oldOrder },
                  },
                  data: {
                    cartOrder: {
                      [isMoveDown ? "decrement" : "increment"]: 1,
                    },
                  },
                });
              }
            }

            return await tx.cartItem.update({
              where: { id: itemId },
              data: updatedData,
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
  }
);

// 3.8. Remove course from timetable
carts.delete(":cartId/items/:itemId", async (c) => {
  const payload = c.get("jwtPayload");
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

          await tx.cartItem.updateMany({
            where: {
              cartId: cartItem.cartId,
              cartOrder: {
                gt: cartItem.cartOrder,
              },
            },
            data: {
              cartOrder: {
                decrement: 1,
              },
            },
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
