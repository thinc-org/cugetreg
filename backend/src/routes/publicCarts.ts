import { prisma } from "../db/clients.js";
import { Visible } from "../generated/prisma/enums.js";
import { middlewareAuth } from "./auth.js";
import { ImportTimetableBodySchema } from "../zod_schemas/publicCcarts.schema.js";
import { Effect, Console } from "effect";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getPublicCartDetailRoute,
  importPublicCartRoute,
} from "../routes_define/public_carts.routes.js";
import type {
  ClassConflict,
  ClassScheduleItem,
  ExamConflict,
  ExamScheduleItem,
} from "../zod_schemas/carts.response.schema.js";
import type { PublicCartItemDetail } from "../zod_schemas/publicCarts.response.schema.js";
import dayjs from "dayjs";
import type { Variables } from "../lib/auth.js";
import { LexoRankService } from "../services/lexorank.service.js";

const publicCarts = new OpenAPIHono<{ Variables: Variables }>();
publicCarts.use("/:cartId/import", middlewareAuth);

publicCarts
  // 4.1. Public view of timetable (from share with link)
  // Similar to 3.5
  .openapi(getPublicCartDetailRoute, async (c) => {
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

      if (!cart || cart.visible === "PRIVATE") {
        return yield* Effect.fail(
          new Error("PUBLIC_CART_NOT_FOUND_OR_PRIVATE")
        );
      }

      const itemsResponse: PublicCartItemDetail[] = [];
      const classesSchedule: ClassScheduleItem[] = [];
      const examsSchedule: ExamScheduleItem[] = [];
      let totalCredits = 0;

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

        // Format Items
        itemsResponse.push({
          id: item.id,
          courseNo: item.courseNo,
          sectionNo: item.sectionNo,
          color: item.color,
          hidden: item.hidden,
          cartOrder: item.cartOrder,
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

      // Conflict Detection Logic (O(n^2))
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
      // Now O(n^2) improve later
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
              items: itemsResponse,
            },
            summary: {
              totalCredits: totalCredits.toFixed(1),
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
          yield* Console.error("Fetch Carts Error:", err);
          if (err.message === "PUBLIC_CART_NOT_FOUND_OR_PRIVATE") {
            return c.json({ error: "PUBLIC_CART_NOT_FOUND_OR_PRIVATE" }, 404);
          }
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        })
      )
    );

    return await Effect.runPromise(program);
  })

  // 4.2. Import timetable from public link
  .openapi(importPublicCartRoute, async (c) => {
    const payload = c.get("user");
    const userId = payload.id;
    const cartId = c.req.param("cartId");

    const program = Effect.gen(function* () {
      const sourceCart = yield* Effect.tryPromise({
        try: () =>
          prisma.cart.findUnique({
            where: { id: cartId },
            include: { items: true },
          }),
        catch: (err) => err as Error,
      });

      if (!sourceCart || sourceCart.visible !== Visible.PUBLIC) {
        return yield* Effect.fail(
          new Error("PUBLIC_CART_NOT_FOUND_OR_PRIVATE")
        );
      }

      // Find next cartOrder
      const lastCart = yield* Effect.tryPromise({
        try: () =>
          prisma.cart.findFirst({
            where: { userId: userId },
            orderBy: { cartOrder: "desc" },
          }),
        catch: (err) => err as Error,
      });
      const nextOrder = LexoRankService.getNextRank(lastCart?.cartOrder);

      // For Timetable Name
      const rawBody = yield* Effect.tryPromise({
        try: () => c.req.json().catch(() => ({})),
        catch: (err) => err as Error,
      });
      const body = ImportTimetableBodySchema.parse(rawBody);

      const newCart = yield* Effect.tryPromise({
        try: () =>
          prisma.$transaction(async (tx) => {
            return await tx.cart.create({
              data: {
                userId: userId,
                name: body.name || "Copy Timetable",
                studyProgram: sourceCart.studyProgram,
                academicYear: sourceCart.academicYear,
                semester: sourceCart.semester,
                visible: Visible.PRIVATE,
                isDefault: false,
                cartOrder: nextOrder,
                items: {
                  create: sourceCart.items.map((item) => ({
                    courseNo: item.courseNo,
                    sectionNo: item.sectionNo,
                    color: item.color,
                    hidden: item.hidden,
                    cartOrder: item.cartOrder,
                    isGraded: false,
                    expectedGrade: 0,
                  })),
                },
              },
              include: {
                items: true,
              },
            });
          }),
        catch: (err) => err as Error,
      });

      return c.json({ data: { cart: newCart } }, 201);
    }).pipe(
      Effect.catchAll((err) =>
        Effect.gen(function* () {
          yield* Console.error("Import Error:", err);
          if (err.message === "PUBLIC_CART_NOT_FOUND_OR_PRIVATE") {
            return c.json({ error: "PUBLIC_CART_NOT_FOUND_OR_PRIVATE" }, 404);
          }

          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        })
      )
    );

    return await Effect.runPromise(program);
  });

export default publicCarts;
