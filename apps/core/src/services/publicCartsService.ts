import { prisma } from "@/db/clients.js";
import {
  type Course,
  type Section,
  type SectionClass,
  Visible,
} from "@/generated/prisma/client.js";

import * as R from "remeda";

import type {
  ClassScheduleItem,
  ExamScheduleItem,
} from "@cugetreg/zod-schemas/carts-response";
import type { GenEdType } from "@cugetreg/zod-schemas/constants";

import {
  detectClassConflicts,
  detectExamConflicts,
} from "./conflictDetection.js";
import { LexoRankService } from "./lexorank.service.js";

export const publicCartsService = {
  getPublicCartDetail: async (cartId: string) => {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          orderBy: { cartOrder: "asc" },
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

    if (!cart || cart.visible === Visible.PVT) {
      throw new Error("CART_NOT_FOUND");
    }

    const owner = await prisma.user.findFirst({
      where: { id: cart.userId },
    });

    const enrichedItems = R.map(cart.items, (item) => {
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
        sections: courseData?.sections ?? [],
      };
    });

    // 2. Format Items Response
    const itemsResponse = R.map(enrichedItems, (item) => ({
      id: item.id,
      courseNo: item.courseNo,
      sectionNo: item.sectionNo,
      color: item.color,
      hidden: item.hidden,
      cartOrder: item.cartOrder,
      genEdType: (item.courseData?.genEdType ?? "NO") as GenEdType,
      course: {
        abbrName: item.info.abbrName,
        courseNameTh: item.info.courseNameTh,
        courseNameEn: item.info.courseNameEn,
        credit: item.info.credit.toString(),
      },
      sections: item.sections,
    }));

    // 3. Extract Schedules
    const classesSchedule: ClassScheduleItem[] = R.flatMap(
      enrichedItems,
      (item) =>
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
    );

    const examsSchedule: ExamScheduleItem[] = R.flatMap(
      enrichedItems,
      (item) => {
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
      },
    );

    const classConflicts = detectClassConflicts(classesSchedule);
    const examConflicts = detectExamConflicts(examsSchedule);

    const totalCredits = R.sumBy(enrichedItems, (item) =>
      Number(item.info.credit),
    );

    const cartDetail = {
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

    return {
      cartDetail,
      owner: owner?.name,
    };
  },

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

    const newCart = await prisma.$transaction(async (tx) => {
      const created = await tx.cart.create({
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

      return {
        ...created,
        items: created.items.map((item) => {
          const matchingCourse = item.courseInfo.courses.find(
            (course) =>
              course.academicYear === created.academicYear &&
              course.semester === created.semester &&
              course.studyProgram === created.studyProgram,
          );
          return {
            id: item.id,
            courseNo: item.courseNo,
            sectionNo: item.sectionNo,
            color: item.color,
            hidden: item.hidden,
            cartOrder: item.cartOrder,
            genEdType: (matchingCourse?.genEdType ?? "NO") as GenEdType,
            course: {
              abbrName: item.courseInfo.abbrName,
              courseNameTh: item.courseInfo.courseNameTh,
              courseNameEn: item.courseInfo.courseNameEn,
              credit: item.courseInfo.credit.toString(),
            },
            sections: matchingCourse?.sections ?? [],
          };
        }),
      };
    });

    return newCart;
  },
};
