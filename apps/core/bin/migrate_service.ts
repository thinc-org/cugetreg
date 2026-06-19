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

// ── Bulk: CourseInfo ──────────────────────────────────────────────────────────
// One INSERT ... ON CONFLICT DO NOTHING for the entire dataset.

export async function bulkMigrateCourseInfo(coursesData: Course[]) {
  await prisma.courseInfo.createMany({
    data: coursesData.map((data) => ({
      courseNo: data.courseNo,
      abbrName: data.abbrName,
      courseNameEn: data.courseNameEn,
      courseNameTh: data.courseNameTh,
      courseDescEn: data.courseDescEn ?? null,
      courseDescTh: data.courseDescTh ?? null,
      faculty: data.faculty ?? null,
      department: data.department ?? null,
      credit: new Prisma.Decimal(data.credit),
      creditHours: data.creditHours ?? null,
      gradingType: data.creditHours?.includes("S/U")
        ? GradingType.SU
        : GradingType.LETTER,
      academicYear: parseInt(data.academicYear),
      semester: mapSemester(data.semester),
      studyProgram: mapStudyProgram(data.studyProgram),
    })),
    skipDuplicates: true,
  });
}

// ── Bulk: Course + Section + SectionClass ─────────────────────────────────────
// Fetches existing courses in one query, then batches new ones into $transaction
// groups so sections/classes get their courseId/sectionId from nested creates.

const COURSE_BATCH = 200;

export async function bulkMigrateCoursesWithSections(
  coursesData: Course[],
  genEdOverrideByCourseNo: Record<string, GenEdType>,
  onProgress: (done: number, total: number) => void,
): Promise<{ created: number; skipped: number }> {
  const existing = await prisma.course.findMany({
    select: {
      courseNo: true,
      academicYear: true,
      semester: true,
      studyProgram: true,
    },
  });
  const existingSet = new Set(
    existing.map(
      (c) => `${c.studyProgram}|${c.academicYear}|${c.semester}|${c.courseNo}`,
    ),
  );

  const newCourses = coursesData.filter(
    (c) =>
      !existingSet.has(
        `${mapStudyProgram(c.studyProgram)}|${parseInt(c.academicYear)}|${mapSemester(c.semester)}|${c.courseNo}`,
      ),
  );

  let done = 0;
  for (let i = 0; i < newCourses.length; i += COURSE_BATCH) {
    const batch = newCourses.slice(i, i + COURSE_BATCH);
    await prisma.$transaction(
      batch.map((data) => {
        const currentGenEd =
          genEdOverrideByCourseNo[data.courseNo] ?? ("NO" as GenEdType);
        return prisma.course.create({
          data: {
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
            finalStart: parseExamDate(
              data.final?.date,
              data.final?.period?.start,
            ),
            finalEnd: parseExamDate(
              data.final?.date,
              data.final?.period?.end,
            ),
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
      }),
      { timeout: 60_000 },
    );
    done += batch.length;
    onProgress(done, newCourses.length);
  }

  return { created: newCourses.length, skipped: existing.length };
}

// ── Bulk: Review ──────────────────────────────────────────────────────────────
// Single INSERT ... ON CONFLICT DO NOTHING for all reviews.

export async function bulkMigrateReviews(reviewsData: Review[]) {
  return prisma.review.createMany({
    data: reviewsData.map((item) => ({
      id: item._id.$oid,
      content: item.content,
      rating: item.rating,
      courseNo: item.courseNo,
      academicYear: parseInt(item.academicYear),
      semester: mapSemester(item.semester),
      studyProgram: mapStudyProgram(item.studyProgram),
      status: item.status,
      rejectionReason: item.rejectionReason ?? null,
      userId: item.ownerId.$oid,
    })),
    skipDuplicates: true,
  });
}

// ── Per-user migration (kept for cart/cartItem nested logic) ──────────────────

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
