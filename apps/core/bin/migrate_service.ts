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
    return JSON.parse(fs.readFileSync(path, "utf-8")) as T;
  } catch (e) {
    throw new Error(`Failed to read/parse ${path}`, { cause: e });
  }
}

/**
 * Normalize period time strings before inserting into the database.
 * Fixes common typos (80:00 → 08:00, 90:00 → 09:00).
 * Keeps sentinel values IA (Irregular Arrangement) and AR (To Be Arranged) as-is.
 */
function sanitizePeriod(value: string): string {
  if (value === "80:00") {
    return "08:00";
  }
  if (value === "90:00") {
    return "09:00";
  }
  return value;
}

/**
 * Optionally swap reversed period pairs when FIX_PERIOD_SWAPS=true.
 * Catches data-entry errors like 17:00-12:00 → 12:00-17:00.
 */
function sanitizePeriodPair(
  start: string,
  end: string,
): { start: string; end: string } {
  if (process.env.FIX_PERIOD_SWAPS !== "true") {
    return { start, end };
  }
  const HHMM_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (HHMM_RE.test(start) && HHMM_RE.test(end) && start > end) {
    return { start: end, end: start };
  }
  return { start, end };
}

function courseKey(c: {
  studyProgram: string;
  academicYear: string | number;
  semester: string;
  courseNo: string;
}) {
  return `${c.studyProgram}|${c.academicYear}|${c.semester}|${c.courseNo}`;
}

// ── Bulk: CourseInfo ──────────────────────────────────────────────────────────
// Called with a pre-sliced batch from migrate_course.ts (5k rows at a time).

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
// 4 queries total:
//   1. find existing course keys
//   2. createManyAndReturn courses  → get auto-generated course IDs
//   3. createManyAndReturn sections → get auto-generated section IDs
//   4. createMany classes
// All batched to keep individual payloads under ~20k rows.

const COURSE_BATCH = 5_000;
const SECTION_BATCH = 20_000;
const CLASS_BATCH = 50_000;

export async function bulkMigrateCoursesWithSections(
  coursesData: Course[],
  genEdOverrideByCourseNo: Record<string, GenEdType>,
  onProgress: (step: string, done: number, total: number) => void,
): Promise<{ created: number; skipped: number }> {
  // 1. Find existing courses in one query
  onProgress("checking existing", 0, 1);
  const existing = await prisma.course.findMany({
    select: {
      courseNo: true,
      academicYear: true,
      semester: true,
      studyProgram: true,
    },
  });
  const existingSet = new Set(
    existing.map((c) =>
      courseKey({
        ...c,
        academicYear: String(c.academicYear),
        semester: String(c.semester),
        studyProgram: String(c.studyProgram),
      }),
    ),
  );

  const newCourses = coursesData.filter(
    (c) =>
      !existingSet.has(
        courseKey({
          studyProgram: mapStudyProgram(c.studyProgram),
          academicYear: String(parseInt(c.academicYear)),
          semester: mapSemester(c.semester),
          courseNo: c.courseNo,
        }),
      ),
  );

  if (newCourses.length === 0) {
    return { created: 0, skipped: existing.length };
  }

  // 2. Bulk-insert courses, get IDs back
  const courseIdMap = new Map<string, string>();
  for (let i = 0; i < newCourses.length; i += COURSE_BATCH) {
    const batch = newCourses.slice(i, i + COURSE_BATCH);
    const created = await prisma.course.createManyAndReturn({
      data: batch.map((data) => {
        const currentGenEd =
          genEdOverrideByCourseNo[data.courseNo] ?? ("NO" as GenEdType);
        return {
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
          finalEnd: parseExamDate(data.final?.date, data.final?.period?.end),
          genEdType: currentGenEd,
        };
      }),
      skipDuplicates: true,
    });
    created.forEach((c) =>
      courseIdMap.set(
        courseKey({
          studyProgram: String(c.studyProgram),
          academicYear: String(c.academicYear),
          semester: String(c.semester),
          courseNo: c.courseNo,
        }),
        c.id,
      ),
    );
    onProgress("courses", i + batch.length, newCourses.length);
  }

  // 3. Build section records (with courseId) then bulk-insert, get IDs back
  type SectionMeta = {
    record: Parameters<typeof prisma.section.create>[0]["data"];
    classRecords: Parameters<typeof prisma.sectionClass.create>[0]["data"][];
  };

  const sectionMetas: SectionMeta[] = [];
  for (const c of newCourses) {
    const courseId = courseIdMap.get(
      courseKey({
        studyProgram: mapStudyProgram(c.studyProgram),
        academicYear: String(parseInt(c.academicYear)),
        semester: mapSemester(c.semester),
        courseNo: c.courseNo,
      }),
    );
    if (!courseId) {
      continue;
    }
    const currentGenEd =
      genEdOverrideByCourseNo[c.courseNo] ?? ("NO" as GenEdType);
    for (const sec of c.sections) {
      sectionMetas.push({
        record: {
          courseId,
          sectionNo: parseInt(sec.sectionNo),
          closed: sec.closed,
          regis: sec.capacity.current,
          max: sec.capacity.max,
          note: sec.note,
          genEdType: currentGenEd,
        },
        classRecords: sec.classes.map((cls) => {
          const pair = sanitizePeriodPair(
            sanitizePeriod(cls.period.start),
            sanitizePeriod(cls.period.end),
          );
          return {
            sectionId: "", // filled in after section insert
            type: cls.type,
            dayOfWeek: mapDayOfWeek(cls.dayOfWeek),
            periodStart: pair.start,
            periodEnd: pair.end,
            building: cls.building,
            room: cls.room,
            professors: cls.teachers,
          };
        }),
      });
    }
  }

  const allClassRecords: Parameters<
    typeof prisma.sectionClass.createMany
  >[0]["data"] = [];

  for (let i = 0; i < sectionMetas.length; i += SECTION_BATCH) {
    const batch = sectionMetas.slice(i, i + SECTION_BATCH);
    const createdSections = await prisma.section.createManyAndReturn({
      data: batch.map((s) => s.record),
    });
    // createManyAndReturn preserves insertion order — match by index
    createdSections.forEach((sec, j) => {
      for (const cls of batch[j]!.classRecords) {
        allClassRecords.push({ ...cls, sectionId: sec.id });
      }
    });
    onProgress("sections", i + batch.length, sectionMetas.length);
  }

  // 4. Bulk-insert all classes
  for (let i = 0; i < allClassRecords.length; i += CLASS_BATCH) {
    await prisma.sectionClass.createMany({
      data: allClassRecords.slice(i, i + CLASS_BATCH),
    });
    onProgress("classes", i + CLASS_BATCH, allClassRecords.length);
  }

  return { created: newCourses.length, skipped: existing.length };
}

// ── Bulk: Review ──────────────────────────────────────────────────────────────

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
