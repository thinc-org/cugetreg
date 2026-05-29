import dayjs from "dayjs";
import * as fs from "fs";
import * as R from "ramda";

import type {
  Course,
  MongoCartItem,
  MongoUser,
  Review,
} from "./migrate_interface.ts";

import { prisma } from "../src/db/clients.js";
import {
  type Cart,
  GradingType,
  Prisma,
  type User,
  Visible,
} from "../src/generated/prisma/client.js";
import type { GenEdType } from "../src/generated/prisma/enums.js";
import { LexoRankService } from "../src/services/lexorank.service.js";
import {
  mapDayOfWeek,
  mapSemester,
  mapStudyProgram,
} from "../src/utils/enumMapper.js";

export function parseExamDate(
  dateStr: string | undefined,
  timeStr: string | undefined,
) {
  if (!dateStr || !timeStr) {
    return null;
  }
  let d = dayjs(dateStr);
  if (d.year() > 2400) {
    d = d.subtract(543, "year");
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  return d.startOf("day").add(hours, "hours").add(minutes, "minutes").toDate();
}

export function safeFsJsonRead<T>(path: string): T {
  try {
    const content = fs.readFileSync(path, "utf-8");
    return JSON.parse(content) as T;
  } catch (e) {
    throw new Error(`Failed to read/parse ${path}`, { cause: e });
  }
}

export async function migrateCourse(data: Course, currentGenEd: GenEdType) {
  try {
    const gradingType =
      data.creditHours && data.creditHours.includes("S/U")
        ? GradingType.SU
        : GradingType.LETTER;

    await prisma.courseInfo.upsert({
      where: { courseNo: data.courseNo },
      update: {
        abbrName: data.abbrName,
        courseNameEn: data.courseNameEn,
        courseNameTh: data.courseNameTh,
        courseDescEn: data.courseDescEn,
        courseDescTh: data.courseDescTh,
        faculty: data.faculty || null,
        department: data.department || null,
        credit: new Prisma.Decimal(data.credit),
        creditHours: data.creditHours || null,
        gradingType,
        academicYear: parseInt(data.academicYear),
        semester: mapSemester(data.semester),
        studyProgram: mapStudyProgram(data.studyProgram),
      },
      create: {
        courseNo: data.courseNo,
        abbrName: data.abbrName,
        courseNameEn: data.courseNameEn,
        courseNameTh: data.courseNameTh,
        courseDescEn: data.courseDescEn,
        courseDescTh: data.courseDescTh,
        faculty: data.faculty || null,
        department: data.department || null,
        credit: new Prisma.Decimal(data.credit),
        creditHours: data.creditHours || null,
        gradingType,
        academicYear: parseInt(data.academicYear),
        semester: mapSemester(data.semester),
        studyProgram: mapStudyProgram(data.studyProgram),
      },
    });

    await prisma.course.upsert({
      where: {
        course_unique: {
          courseNo: data.courseNo,
          academicYear: parseInt(data.academicYear),
          semester: mapSemester(data.semester),
          studyProgram: mapStudyProgram(data.studyProgram),
        },
      },
      update: {},
      create: {
        courseNo: data.courseNo,
        academicYear: parseInt(data.academicYear),
        semester: mapSemester(data.semester),
        studyProgram: mapStudyProgram(data.studyProgram),
        courseCondition: data.courseCondition,
        midtermStart: parseExamDate(
          data.midterm?.date,
          data.midterm?.period?.start,
        ),
        midtermEnd: parseExamDate(
          data.midterm?.date,
          data.midterm?.period?.end,
        ),
        finalStart: parseExamDate(data.final?.date, data.final?.period?.start),
        finalEnd: parseExamDate(data.final?.date, data.final?.period?.end),
        genEdType: currentGenEd,
        sections: {
          create: data.sections.map((sec) => ({
            sectionNo: parseInt(sec.sectionNo),
            closed: sec.closed,
            regis: sec.capacity.current,
            max: sec.capacity.max,
            note: sec.note,
            genEdType: currentGenEd,
            classes: {
              create: sec.classes.map((cls) => ({
                type: cls.type,
                dayOfWeek: mapDayOfWeek(cls.dayOfWeek),
                periodStart: cls.period.start,
                periodEnd: cls.period.end,
                building: cls.building,
                room: cls.room,
                professors: cls.teachers,
              })),
            },
          })),
        },
      },
    });
  } catch (err) {
    console.error(`Skipping ${data.courseNo}: ${(err as Error).message}`);
  }
}

export async function migrateReview(item: Review) {
  try {
    await prisma.review.upsert({
      where: { id: item._id.$oid },
      update: {},
      create: {
        id: item._id.$oid,
        content: item.content,
        rating: item.rating,
        courseNo: item.courseNo,
        academicYear: parseInt(item.academicYear),
        semester: mapSemester(item.semester),
        studyProgram: mapStudyProgram(item.studyProgram),
        status: item.status,
        rejectionReason: item.rejectionReason || null,
        user: { connect: { id: item.ownerId.$oid } },
      },
    });
  } catch (err) {
    console.error(`Failed to migrate review: ${(err as Error).message}`);
  }
}

export async function migrateUser(mongoUser: MongoUser) {
  try {
    const user = (await prisma.user.upsert({
      where: { id: mongoUser._id.$oid },
      update: { name: mongoUser.name, email: mongoUser.email },
      create: {
        id: mongoUser._id.$oid,
        email: mongoUser.email,
        name: mongoUser.name,
        image: null,
        faculty: null,
        department: null,
        emailVerified: true,
        accounts: {
          create: {
            id: mongoUser._id.$oid,
            accountId: mongoUser.google.googleId,
            providerId: "google",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    })) as User;

    if (mongoUser.courseCart?.cartContent?.length) {
      const cartGroups = R.groupBy(
        (item: MongoCartItem) =>
          `${item.academicYear}-${item.semester}-${item.studyProgram}`,
        mongoUser.courseCart.cartContent,
      );

      const sortedGroupKeys = Object.keys(cartGroups).sort().reverse();
      const latestGroupKey = sortedGroupKeys[0];

      for (const groupKey in cartGroups) {
        const items = cartGroups[groupKey]!;
        const first = items[0];

        const cart = (await prisma.cart.create({
          data: {
            userId: user.id,
            academicYear: parseInt(first.academicYear),
            semester: mapSemester(first.semester),
            studyProgram: mapStudyProgram(first.studyProgram),
            name: "My Schedule",
            visible: Visible.PVT,
            isDefault: groupKey === latestGroupKey,
            cartOrder: LexoRankService.INITIAL_RANK,
          },
        })) as Cart;

        const sortedItems = [...items].sort(
          (a, b) => (a.cartOrder ?? 0) - (b.cartOrder ?? 0),
        );
        let currentItemRank: string | undefined = undefined;

        for (const item of sortedItems) {
          currentItemRank = LexoRankService.getNextRank(currentItemRank);
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              courseNo: item.courseNo,
              sectionNo: parseInt(item.selectedSectionNo),
              color: item.color,
              hidden: item.isHidden || false,
              cartOrder: currentItemRank,
              isGraded: false,
              expectedGrade: 0,
            },
          });
        }
      }
    }
  } catch (err) {
    console.error(`Skipping ${mongoUser.email}: ${(err as Error).message}`);
  }
}

export async function runConcurrent<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}
