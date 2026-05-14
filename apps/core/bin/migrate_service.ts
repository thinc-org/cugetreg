import dayjs from "dayjs";
import { Console, Effect } from "effect";
import * as fs from "fs";
import * as R from "ramda";

import type {
  Course,
  MongoCartItem,
  MongoUser,
  Review,
} from "./migrate_interface.ts";

import {
  type Cart,
  Prisma,
  type User,
  Visible,
} from "../src/generated/prisma/client.js";
import type { GenEdType } from "../src/generated/prisma/enums.js";
import { PrismaService } from "../src/generated/prisma-effect/index.js";
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

export const safeFsJsonRead = <T>(path: string) =>
  Effect.try({
    try: () => fs.readFileSync(path, "utf-8"),
    catch: (e) => new Error(`JSON read failed`, { cause: e }),
  }).pipe(Effect.flatMap((content) => safeParseJSON<T>(content)));

const safeParseJSON = <T>(jsonString: string) =>
  Effect.try({
    try: () => JSON.parse(jsonString) as T,
    catch: (e) => new Error(`JSON parsing failed`, { cause: e }),
  });

export const migrateCourse = (data: Course, currentGenEd: GenEdType) =>
  Effect.gen(function* (_) {
    const prisma = yield* PrismaService;
    yield* prisma.courseInfo.upsert({
      where: { courseNo: data.courseNo },
      update: {
        abbrName: data.abbrName,
        courseNameEn: data.courseNameEn,
        courseNameTh: data.courseNameTh,
        courseDescEn: data.courseDescEn,
        courseDescTh: data.courseDescTh,
        faculty: data.faculty || "",
        department: data.department || "",
        credit: new Prisma.Decimal(data.credit),
        creditHours: data.creditHours || null,
        gradingType:
          data.creditHours && data.creditHours.includes("S/U")
            ? GradingType.SU
            : GradingType.LETTER,
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
        faculty: data.faculty || "",
        department: data.department || "",
        credit: new Prisma.Decimal(data.credit),
        creditHours: data.creditHours || null,
        gradingType:
          data.creditHours && data.creditHours.includes("S/U")
            ? GradingType.SU
            : GradingType.LETTER,
        academicYear: parseInt(data.academicYear),
        semester: mapSemester(data.semester),
        studyProgram: mapStudyProgram(data.studyProgram),
      },
    });

    yield* prisma.course.upsert({
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

    yield* Console.log(`Successfully migrated: ${data.courseNo}`);
  }).pipe(
    Effect.catchAll((err) =>
      Console.error(`Skipping ${data.courseNo}: ${err.message}`),
    ),
  );

export const migrateReview = (item: Review) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    yield* prisma.review.upsert({
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
        user: {
          connect: { id: item.ownerId.$oid },
        },
      },
    });

    yield* Console.log(`Migrated review: ${item._id.$oid}`);
  }).pipe(
    Effect.catchAll((err) =>
      Console.error(`Failed to migrate review: ${err.message}`),
    ),
  );

export const migrateUser = (mongoUser: MongoUser) =>
  Effect.gen(function* (_) {
    const prisma = yield* PrismaService;
    const user = (yield* prisma.user.upsert({
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

        const cart = (yield* prisma.cart.create({
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

          yield* prisma.cartItem.create({
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

    yield* Console.log(`Successfully migrated: ${user.name}`);
  }).pipe(
    Effect.catchAll((err) =>
      Console.error(`Skipping ${mongoUser.email}: ${err.message}`),
    ),
  );
