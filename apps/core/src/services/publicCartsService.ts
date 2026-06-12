import type {
  ClassScheduleItem,
  ExamScheduleItem,
} from "@cugetreg/zod-schemas/carts-response";
import type { PublicCartItemDetail } from "@cugetreg/zod-schemas/public-carts-response";

import {
  detectClassConflicts,
  detectExamConflicts,
} from "./conflictDetection.js";
import { LexoRankService } from "./lexorank.service.js";

import { prisma } from "../db/clients.js";
import { Visible } from "../generated/prisma/client.js";

export const publicCartsService = {
  // Read-only view of a shared timetable — visible to anyone with the link
  /* eslint-disable @typescript-eslint/no-explicit-any */
  getPublicCartDetail: async (cartId: string) => {
    const cart = (await prisma.cart.findUnique({
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
    })) as any;

    if (!cart || cart.visible === "PRIVATE") {
      throw new Error("PUBLIC_CART_NOT_FOUND_OR_PRIVATE");
    }

    const itemsResponse: PublicCartItemDetail[] = [];
    const classesSchedule: ClassScheduleItem[] = [];
    const examsSchedule: ExamScheduleItem[] = [];
    let totalCredits = 0;

    for (const item of cart.items) {
      const info = item.courseInfo;
      const creditValue = Number(info.credit);

      const courseData = info.courses.find(
        (course: any) =>
          course.academicYear === cart.academicYear &&
          course.semester === cart.semester &&
          course.studyProgram === cart.studyProgram,
      );

      const sectionData = courseData?.sections.find(
        (sec: any) => sec.sectionNo === item.sectionNo,
      );

      totalCredits += creditValue;

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
        sections: courseData?.sections || [],
      });

      for (const cls of sectionData?.classes ?? []) {
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
      }

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
          end: courseData.finalEnd.toISOString(),
        });
      }
    }

    const classConflicts = detectClassConflicts(classesSchedule);
    const examConflicts = detectExamConflicts(examsSchedule);

    return {
      cart: {
        id: cart.id,
        name: cart.name,
        studyProgram: cart.studyProgram,
        academicYear: cart.academicYear,
        semester: cart.semester,
        items: itemsResponse,
      },
      summary: { totalCredits: totalCredits.toFixed(1) },
      conflicts: { classConflicts, examConflicts },
      schedule: { classes: classesSchedule, exams: examsSchedule },
    };
  },
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Clone a public cart into the user's own carts — always created as private, isGraded/grade reset
  importPublicCart: async (userId: string, cartId: string, name?: string) => {
    const sourceCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!sourceCart || sourceCart.visible !== Visible.PUB) {
      throw new Error("PUBLIC_CART_NOT_FOUND_OR_PRIVATE");
    }

    const lastCart = await prisma.cart.findFirst({
      where: { userId },
      orderBy: { cartOrder: "desc" },
    });

    const nextOrder = LexoRankService.getNextRank(lastCart?.cartOrder);

    return prisma.$transaction(async (tx) => {
      return tx.cart.create({
        data: {
          userId,
          name: name || "Copy Timetable",
          studyProgram: sourceCart.studyProgram,
          academicYear: sourceCart.academicYear,
          semester: sourceCart.semester,
          visible: Visible.PVT,
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
        include: { items: true },
      });
    });
  },
};
