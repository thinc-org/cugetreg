import dayjs from "dayjs";
import { Effect } from "effect";
import * as R from "remeda";

import { LexoRankService } from "./lexorank.service.js";

import type {
  Cart,
  CartItem,
  Course,
  Section,
  SectionClass,
} from "../generated/prisma/client.js";
import { PrismaService } from "../generated/prisma-effect/index.js";
import type {
  ClassConflict,
  ExamConflict,
  ExamScheduleItem,
} from "../zod_schemas/carts.response.schema.js";
import type {
  AddCourseBodySchema,
  CreateCartBodySchema,
  ListCartsQuerySchema,
  UpdateCartBodySchema,
  UpdateCourseBodySchema,
} from "../zod_schemas/carts.schema.js";

export const cartService = {
  getAllCartItems: (userId: string, query: ListCartsQuerySchema) =>
    Effect.gen(function* () {
      const prisma = yield* PrismaService;
      return (yield* prisma.cart.findMany({
        where: { userId, ...query },
      })) as Cart[];
    }),

  createCart: (userId: string, validatedData: CreateCartBodySchema) =>
    Effect.gen(function* () {
      const db = yield* PrismaService;
      const newCart = (yield* db.$transaction(
        Effect.gen(function* () {
          // Set other isDefault
          if (validatedData.isDefault) {
            yield* db.cart.updateMany({
              where: { userId, isDefault: true },
              data: { isDefault: false },
            });
          }

          const lastCart = yield* db.cart
            .findFirst({
              where: {
                userId,
                academicYear: validatedData.academicYear,
                semester: validatedData.semester,
                studyProgram: validatedData.studyProgram,
              },
              orderBy: { cartOrder: "desc" },
            })
            .pipe(Effect.map((res) => res as Cart | null));

          const nextCartOrder = LexoRankService.getNextRank(
            lastCart?.cartOrder,
          );

          return yield* db.cart.create({
            data: {
              userId,
              cartOrder: nextCartOrder,
              ...validatedData,
            },
          });
        }),
      )) as Cart;
      return newCart;
    }),

  updateCart: (
    userId: string,
    cartId: string,
    updatedData: UpdateCartBodySchema,
  ) =>
    Effect.gen(function* () {
      const db = yield* PrismaService;

      const updatedCart = yield* db.$transaction(
        Effect.gen(function* () {
          // Find current cart
          const targetCart = yield* db.cart
            .findFirst({
              where: { id: cartId },
            })
            .pipe(Effect.map((r) => r as Cart | null));

          if (!targetCart) {
            yield* Effect.fail(new Error("CART_NOT_FOUND"));
          }
          if (targetCart!.userId !== userId) {
            yield* Effect.fail(new Error("NOT_CART_OWNER"));
          }

          // Set other isDefault
          if (updatedData.isDefault === true) {
            yield* db.cart.updateMany({
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
            const [prevCart, nextCart] = yield* Effect.all([
              prevId
                ? db.cart
                    .findUnique({ where: { id: prevId } })
                    .pipe(Effect.map((r) => r as Cart | null))
                : Effect.succeed(null),
              nextId
                ? db.cart
                    .findUnique({ where: { id: nextId } })
                    .pipe(Effect.map((r) => r as Cart | null))
                : Effect.succeed(null),
            ]);

            dataToUpdate.cartOrder = LexoRankService.getBetweenRank(
              prevCart?.cartOrder,
              nextCart?.cartOrder,
            );
          }

          return yield* db.cart
            .update({
              where: { id: cartId },
              data: dataToUpdate,
            })
            .pipe(Effect.map((r) => r as Cart));
        }),
      );

      return updatedCart;
    }),

  deleteCart: (userId: string, cartId: string) =>
    Effect.gen(function* () {
      const db = yield* PrismaService;

      yield* db.$transaction(
        Effect.gen(function* () {
          const targetCart = yield* db.cart
            .findUnique({
              where: { id: cartId },
            })
            .pipe(Effect.map((r) => r as Cart | null));

          if (!targetCart) {
            yield* Effect.fail(new Error("CART_NOT_FOUND"));
          }
          if (targetCart!.userId !== userId) {
            yield* Effect.fail(new Error("NOT_CART_OWNER"));
          }

          yield* db.cart.delete({
            where: { id: cartId },
          });

          // Case deletedCart is default assign least cartOrder to be next default
          if (targetCart!.isDefault) {
            const nextDefaultCart = yield* db.cart
              .findFirst({
                where: {
                  userId,
                },
                orderBy: { cartOrder: "asc" },
              })
              .pipe(Effect.map((r) => r as Cart | null));

            if (nextDefaultCart) {
              yield* db.cart.update({
                where: { id: nextDefaultCart.id },
                data: { isDefault: true },
              });
            }
          }
        }),
      );
    }),

  getCartDetail: (userId: string, cartId: string) =>
    Effect.gen(function* () {
      const db = yield* PrismaService;

      const cart = yield* db.cart
        .findUnique({
          where: { id: cartId },
          include: {
            items: {
              include: {
                courseInfo: {
                  include: {
                    courses: {
                      include: {
                        sections: { include: { classes: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        })
        .pipe(Effect.map((r) => r as any));

      if (!cart) {
        return yield* Effect.fail(new Error("CART_NOT_FOUND"));
      }
      // if (cart.userId !== userId) {
      //   return yield* Effect.fail(new Error("NOT_CART_OWNER"));
      // }

      // 1. Data Enrichment
      const enrichedItems = R.pipe(
        cart.items,
        R.map((item) => {
          const info = item.courseInfo;
          const courseData = info.courses.find(
            (course: Course) =>
              course.academicYear === cart.academicYear &&
              course.semester === cart.semester &&
              course.studyProgram === cart.studyProgram,
          );
          const sectionData = courseData?.sections.find(
            (sec: Section) => sec.sectionNo === item.sectionNo,
          );

          return { ...item, info, courseData, sectionData, sections: courseData?.sections};
        }),
      );

      // 2. Format Items Response
      const itemsResponse = R.map(enrichedItems, (item) => ({
        id: item.id,
        courseNo: item.courseNo,
        sectionNo: item.sectionNo,
        color: item.color,
        hidden: item.hidden,
        cartOrder: item.cartOrder,
        isGraded: item.isGraded,
        expectedGrade: item.expectedGrade.toString(),
        course: {
          courseNameTh: item.info.courseNameTh,
          courseNameEn: item.info.courseNameEn,
          credit: item.info.credit.toString(),
        },
        section: item.sectionData
          ? {
              closed: item.sectionData.closed,
              regis: item.sectionData.regis,
              max: item.sectionData.max,
              note: item.sectionData.note,
            }
          : null,
        sections: item.sections
      }));


      // 3. Extract Schedules
      const classesSchedule = R.pipe(
        enrichedItems,
        R.flatMap((item) =>
          (item.sectionData?.classes ?? []).map((cls: SectionClass) => ({
            cartItemId: item.id,
            courseNo: item.courseNo,
            sectionNo: item.sectionNo,
            ...R.pick(cls, [
              "type",
              "dayOfWeek",
              "periodStart",
              "periodEnd",
              "building",
              "room",
              "professors",
            ]),
          })),
        ),
      );

      const examsSchedule = R.pipe(
        enrichedItems,
        R.flatMap((item) => {
          const exams: ExamScheduleItem[] = [];
          if (item.courseData?.midtermStart && item.courseData.midtermEnd) {
            exams.push({
              cartItemId: item.id,
              courseNo: item.courseNo,
              type: "MIDTERM",
              start: item.courseData.midtermStart.toISOString(),
              end: item.courseData.midtermEnd.toISOString(),
            });
          }
          if (item.courseData?.finalStart && item.courseData.finalEnd) {
            exams.push({
              cartItemId: item.id,
              courseNo: item.courseNo,
              type: "FINAL",
              start: item.courseData.finalStart.toISOString(),
              end: item.courseData.finalEnd.toISOString(),
            });
          }
          return exams;
        }),
      );

      // 4. Conflicts Logic (Declarative approach)
      const classConflicts = R.pipe(classesSchedule, (schedules) => {
        const conflicts: ClassConflict[] = [];
        for (let i = 0; i < schedules.length; i++) {
          for (let j = i + 1; j < schedules.length; j++) {
            const a = schedules[i];
            const b = schedules[j];
            if (a.dayOfWeek === b.dayOfWeek) {
              const startA = dayjs(`2000-01-01T${a.periodStart}`);
              const endA = dayjs(`2000-01-01T${a.periodEnd}`);
              const startB = dayjs(`2000-01-01T${b.periodStart}`);
              const endB = dayjs(`2000-01-01T${b.periodEnd}`);

              if (startA.isBefore(endB) && startB.isBefore(endA)) {
                conflicts.push({
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
        return conflicts;
      });

      const examConflicts = R.pipe(examsSchedule, (exams) => {
        const conflicts: ExamConflict[] = [];
        for (let i = 0; i < exams.length; i++) {
          for (let j = i + 1; j < exams.length; j++) {
            const a = exams[i];
            const b = exams[j];
            const startA = dayjs(a.start),
              endA = dayjs(a.end);
            const startB = dayjs(b.start),
              endB = dayjs(b.end);

            if (startA.isBefore(endB) && startB.isBefore(endA)) {
              conflicts.push({
                type: "EXAM_OVERLAP",
                itemIds: [a.cartItemId, b.cartItemId],
                start: startA.isAfter(startB) ? a.start : b.start,
                end: endA.isBefore(endB) ? a.end : b.end,
              });
            }
          }
        }
        return conflicts;
      });

      // 5. Calculate Summary
      const gradedItems = R.filter(enrichedItems, (item) => item.isGraded);
      const totalGradedCredits = R.sumBy(gradedItems, (item) =>
        Number(item.info.credit),
      );
      const totalPoints = R.sumBy(
        gradedItems,
        (item) => Number(item.info.credit) * Number(item.expectedGrade),
      );

      return {
        cart: {
          id: cart.id,
          name: cart.name,
          studyProgram: cart.studyProgram,
          academicYear: cart.academicYear,
          semester: cart.semester,
          isDefault: cart.isDefault,
          cartOrder: cart.cartOrder,
          visible: cart.visible,
          items: itemsResponse,
        },
        summary: {
          totalCredits: R.sumBy(enrichedItems, (x) =>
            Number(x.info.credit),
          ).toFixed(1),
          totalVisibleCredits: R.pipe(
            enrichedItems,
            R.filter((x) => !x.hidden),
            R.sumBy((x) => Number(x.info.credit)),
          ).toFixed(1),
          totalGradedCredits: totalGradedCredits.toFixed(1),
          expectedGPA:
            totalGradedCredits > 0
              ? Number((totalPoints / totalGradedCredits).toFixed(2))
              : 0,
        },
        conflicts: { classConflicts, examConflicts },
        schedule: { classes: classesSchedule, exams: examsSchedule },
      };
    }),

  addCourseToCart: (
    userId: string,
    cartId: string,
    validatedData: AddCourseBodySchema,
  ) =>
    Effect.gen(function* () {
      const db = yield* PrismaService;

      const newItem = (yield* db.$transaction(
        Effect.gen(function* () {
          // Get cart
          const cart = yield* db.cart
            .findUnique({
              where: { id: cartId },
            })
            .pipe(Effect.map((r) => r as Cart | null));

          if (!cart) {
            yield* Effect.fail(new Error("CART_NOT_FOUND"));
          }
          if (cart!.userId !== userId) {
            yield* Effect.fail(new Error("NOT_CART_OWNER"));
          }

          const lastItem = yield* db.cartItem
            .findFirst({
              where: { cartId: cartId },
              orderBy: { cartOrder: "desc" },
            })
            .pipe(Effect.map((r) => r as CartItem | null));

          const nextOrder = LexoRankService.getNextRank(lastItem?.cartOrder);

          // Add new cartItem
          return yield* db.cartItem.create({
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
      )) as CartItem;

      return newItem;
    }),

  updateCourseInCart: (
    userId: string,
    itemId: string,
    updatedData: UpdateCourseBodySchema,
  ) =>
    Effect.gen(function* () {
      const db = yield* PrismaService;

      const updatedItem = (yield* db.$transaction(
        Effect.gen(function* () {
          const targetItem = yield* db.cartItem
            .findUnique({
              where: { id: itemId },
              include: { cart: true },
            })
            .pipe(Effect.map((r) => r as (CartItem & { cart: Cart }) | null));

          if (!targetItem) {
            yield* Effect.fail(new Error("ITEM_NOT_FOUND"));
          }
          if (targetItem!.cart.userId !== userId) {
            yield* Effect.fail(new Error("NOT_CART_OWNER"));
          }

          if (
            updatedData.sectionNo !== undefined &&
            updatedData.sectionNo !== targetItem!.sectionNo
          ) {
            const section = yield* db.section
              .findFirst({
                where: {
                  sectionNo: updatedData.sectionNo,
                  course: {
                    courseNo: targetItem!.courseNo,
                    semester: targetItem!.cart.semester,
                    academicYear: targetItem!.cart.academicYear,
                    studyProgram: targetItem!.cart.studyProgram,
                  },
                },
              })
              .pipe(Effect.map((r) => r as Section | null));

            if (!section) {
              yield* Effect.fail(new Error("SECTION_NOT_FOUND"));
            }
          }

          // Reorder cartOrder -> please review this logic
          const { prevId, nextId, ...dataToUpdate } = updatedData as any;

          if (prevId !== undefined || nextId !== undefined) {
            const [prevItem, nextItem] = yield* Effect.all([
              prevId
                ? db.cartItem
                    .findUnique({ where: { id: prevId } })
                    .pipe(Effect.map((r) => r as CartItem | null))
                : Effect.succeed(null),
              nextId
                ? db.cartItem
                    .findUnique({ where: { id: nextId } })
                    .pipe(Effect.map((r) => r as CartItem | null))
                : Effect.succeed(null),
            ]);

            dataToUpdate.cartOrder = LexoRankService.getBetweenRank(
              prevItem?.cartOrder,
              nextItem?.cartOrder,
            );
          }

          return yield* db.cartItem.update({
            where: { id: itemId },
            data: dataToUpdate,
          });
        }),
      )) as CartItem;

      return updatedItem;
    }),

  removeCourseFromCart: (userId: string, itemId: string) =>
    Effect.gen(function* () {
      const db = yield* PrismaService;

      yield* db.$transaction(
        Effect.gen(function* () {
          const cartItem = yield* db.cartItem
            .findUnique({
              where: { id: itemId },
              include: { cart: true },
            })
            .pipe(Effect.map((r) => r as (CartItem & { cart: Cart }) | null));

          if (!cartItem) {
            yield* Effect.fail(new Error("ITEM_NOT_FOUND"));
          }

          if (cartItem!.cart.userId !== userId) {
            yield* Effect.fail(new Error("NOT_CART_OWNER"));
          }

          yield* db.cartItem.delete({
            where: { id: itemId },
          });
        }),
      );
    }),
};
