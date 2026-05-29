import * as R from "remeda";

import {
  detectClassConflicts,
  detectExamConflicts,
} from "./conflictDetection.js";
import { LexoRankService } from "./lexorank.service.js";

import { prisma } from "../db/clients.js";
import type {
  Course,
  Section,
  SectionClass,
} from "../generated/prisma/client.js";
import type {
  ClassScheduleItem,
  ExamScheduleItem,
} from "../zod_schemas/carts.response.schema.js";
import type {
  AddCourseBodySchema,
  CreateCartBodySchema,
  ListCartsQuerySchema,
  UpdateCartBodySchema,
  UpdateCourseBodySchema,
} from "../zod_schemas/carts.schema.js";
import { genEdType } from "../zod_schemas/constants.js";

export const cartService = {
  getAllCartItems: async (userId: string, query: ListCartsQuerySchema) => {
    return prisma.cart.findMany({
      where: { userId, ...query },
    });
  },

  createCart: async (userId: string, validatedData: CreateCartBodySchema) => {
    return prisma.$transaction(async (tx) => {
      // Only one cart per user can be default — clear the old one before setting the new one
      if (validatedData.isDefault) {
        await tx.cart.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Append after the last cart within the same semester+program so ordering stays stable
      const lastCart = await tx.cart.findFirst({
        where: {
          userId,
          academicYear: validatedData.academicYear,
          semester: validatedData.semester,
          studyProgram: validatedData.studyProgram,
        },
        orderBy: { cartOrder: "desc" },
      });

      const nextCartOrder = LexoRankService.getNextRank(lastCart?.cartOrder);

      return tx.cart.create({
        data: { userId, cartOrder: nextCartOrder, ...validatedData },
      });
    });
  },

  updateCart: async (
    userId: string,
    cartId: string,
    updatedData: UpdateCartBodySchema,
  ) => {
    return prisma.$transaction(async (tx) => {
      const targetCart = await tx.cart.findFirst({ where: { id: cartId } });

      if (!targetCart) {
        throw new Error("CART_NOT_FOUND");
      }
      if (targetCart.userId !== userId) {
        throw new Error("NOT_CART_OWNER");
      }

      if (updatedData.isDefault === true) {
        await tx.cart.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Reorder: resolve neighbour ranks and compute the between-rank string for the new position
      const { prevId, nextId, ...rest } = updatedData;
      const dataToUpdate: Omit<UpdateCartBodySchema, "prevId" | "nextId"> & {
        cartOrder?: string;
      } = { ...rest };

      if (prevId !== undefined || nextId !== undefined) {
        const [prevCart, nextCart] = await Promise.all([
          prevId ? tx.cart.findUnique({ where: { id: prevId } }) : null,
          nextId ? tx.cart.findUnique({ where: { id: nextId } }) : null,
        ]);
        dataToUpdate.cartOrder = LexoRankService.getBetweenRank(
          prevCart?.cartOrder,
          nextCart?.cartOrder,
        );
      }

      return tx.cart.update({ where: { id: cartId }, data: dataToUpdate });
    });
  },

  deleteCart: async (userId: string, cartId: string) => {
    await prisma.$transaction(async (tx) => {
      const targetCart = await tx.cart.findUnique({ where: { id: cartId } });

      if (!targetCart) {
        throw new Error("CART_NOT_FOUND");
      }
      if (targetCart.userId !== userId) {
        throw new Error("NOT_CART_OWNER");
      }

      await tx.cart.delete({ where: { id: cartId } });

      // Promote the next cart to default so the user always has one active timetable
      if (targetCart.isDefault) {
        const nextDefaultCart = await tx.cart.findFirst({
          where: { userId },
          orderBy: { cartOrder: "asc" },
        });
        if (nextDefaultCart) {
          await tx.cart.update({
            where: { id: nextDefaultCart.id },
            data: { isDefault: true },
          });
        }
      }
    });
  },

  /* eslint-disable @typescript-eslint/no-explicit-any */
  getCartDetail: async (userId: string, cartId: string) => {
    const cart = await prisma.cart.findUnique({
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
    });

    if (!cart) {
      throw new Error("CART_NOT_FOUND");
    }

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
        return {
          ...item,
          info,
          courseData,
          sectionData,
          sections: courseData?.sections,
        };
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
      genEdType: item.courseData?.genEdType,
      expectedGrade: item.expectedGrade.toString(),
      course: {
        courseNameTh: item.info.courseNameTh,
        courseNameEn: item.info.courseNameEn,
        credit: item.info.credit.toString(),
        abbrName: item.info.abbrName,
      },
      section: item.sectionData
        ? {
            closed: item.sectionData.closed,
            regis: item.sectionData.regis,
            max: item.sectionData.max,
            note: item.sectionData.note,
          }
        : null,
      sections: item.sections,
    }));

    // 3. Extract Schedules
    const classesSchedule = R.pipe(
      enrichedItems,
      R.flatMap((item: any) =>
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
      R.flatMap((item: any) => {
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

    // 4. Conflict Detection
    const classConflicts = detectClassConflicts(
      classesSchedule as ClassScheduleItem[],
    );
    const examConflicts = detectExamConflicts(examsSchedule);

    // 5. Summary
    const gradedItems = R.filter(enrichedItems, (item: any) => item.isGraded);
    const totalGradedCredits = R.sumBy(gradedItems, (item: any) =>
      Number(item.info.credit),
    );
    const totalPoints = R.sumBy(
      gradedItems,
      (item: any) => Number(item.info.credit) * Number(item.expectedGrade),
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
        totalCredits: R.sumBy(enrichedItems, (x: any) =>
          Number(x.info.credit),
        ).toFixed(1),
        totalVisibleCredits: R.pipe(
          enrichedItems,
          R.filter((x: any) => !x.hidden),
          R.sumBy((x: any) => Number(x.info.credit)),
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
  },
  /* eslint-enable @typescript-eslint/no-explicit-any */

  addCourseToCart: async (
    userId: string,
    cartId: string,
    validatedData: AddCourseBodySchema,
  ) => {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { id: cartId } });

      if (!cart) {
        throw new Error("CART_NOT_FOUND");
      }
      if (cart.userId !== userId) {
        throw new Error("NOT_CART_OWNER");
      }

      const lastItem = await tx.cartItem.findFirst({
        where: { cartId },
        orderBy: { cartOrder: "desc" },
      });

      const nextOrder = LexoRankService.getNextRank(lastItem?.cartOrder);

      return tx.cartItem.create({
        data: {
          cartId,
          courseNo: validatedData.courseNo,
          sectionNo: validatedData.sectionNo,
          color: validatedData.color || "primary",
          isGraded: validatedData.isGraded ?? false,
          expectedGrade: validatedData.expectedGrade ?? 0,
          hidden: validatedData.hidden ?? false,
          cartOrder: nextOrder,
        },
      });
    });
  },

  updateCourseInCart: async (
    userId: string,
    itemId: string,
    updatedData: UpdateCourseBodySchema,
  ) => {
    return prisma.$transaction(async (tx) => {
      const targetItem = await tx.cartItem.findUnique({
        where: { id: itemId },
        include: { cart: true },
      });

      if (!targetItem) {
        throw new Error("ITEM_NOT_FOUND");
      }
      if (targetItem.cart.userId !== userId) {
        throw new Error("NOT_CART_OWNER");
      }

      // Validate the new section exists for this course in the cart's semester before saving
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
        if (!section) {
          throw new Error("SECTION_NOT_FOUND");
        }
      }

      const { prevId, nextId, ...rest } = updatedData;
      const dataToUpdate: Omit<UpdateCourseBodySchema, "prevId" | "nextId"> & {
        cartOrder?: string;
      } = { ...rest };

      if (prevId !== undefined || nextId !== undefined) {
        const [prevItem, nextItem] = await Promise.all([
          prevId ? tx.cartItem.findUnique({ where: { id: prevId } }) : null,
          nextId ? tx.cartItem.findUnique({ where: { id: nextId } }) : null,
        ]);
        dataToUpdate.cartOrder = LexoRankService.getBetweenRank(
          prevItem?.cartOrder,
          nextItem?.cartOrder,
        );
      }

      return tx.cartItem.update({ where: { id: itemId }, data: dataToUpdate });
    });
  },

  removeCourseFromCart: async (userId: string, itemId: string) => {
    await prisma.$transaction(async (tx) => {
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

      await tx.cartItem.delete({ where: { id: itemId } });
    });
  },
};
