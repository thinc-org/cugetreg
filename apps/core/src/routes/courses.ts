import { OpenAPIHono } from "@hono/zod-openapi";

import { prisma } from "../db/clients.js";
import { Prisma } from "../generated/prisma/client.js";
import type { Variables } from "../lib/auth.js";
import {
  getCourseByNoRoute,
  getCoursesRoute,
} from "../routes_define/courses.routes.js";
import {
  mapDayOfWeek,
  mapGenEdType,
  mapGradingType,
  mapStudyProgram,
} from "../utils/enumMapper.js";

// API accepts numeric semester (1/2/3); DB stores enum strings (FIRST/SECOND/SUMMER)
const semesterMap: Record<number, "FIRST" | "SECOND" | "SUMMER"> = {
  1: "FIRST",
  2: "SECOND",
  3: "SUMMER",
};

const courses = new OpenAPIHono<{ Variables: Variables }>();

courses
  // 1.1. Get Courses
  .openapi(getCoursesRoute, async (c) => {
    try {
      const {
        studyProgram,
        academicYear,
        semester,
        genEdType,
        faculty,
        sortBy,
        sortOrder,
        day,
        assessment,
        limit,
        offset,
        q,
        timeStart,
        timeEnd,
        noPrereq,
        fitCardId,
      } = c.req.valid("query");

      const sqlStudyProgram = mapStudyProgram(studyProgram);
      const sqlSemester = semesterMap[semester];
      const sqlGenEd = genEdType ? mapGenEdType(genEdType) : undefined;
      const sqlGrading = assessment ? mapGradingType(assessment) : undefined;
      const sqlDay = day ? mapDayOfWeek(day) : undefined;
      const searchPattern = q ? `%${q}%` : undefined;

      let occupiedSql = Prisma.empty;
      if (fitCardId) {
        const cartItems = await prisma.cartItem.findMany({
          where: { cartId: fitCardId },
        });
        if (cartItems.length > 0) {
          const occupiedSlots = await prisma.sectionClass.findMany({
            where: {
              section: {
                course: {
                  studyProgram: sqlStudyProgram,
                  academicYear,
                  semester: sqlSemester,
                  courseNo: { in: cartItems.map((i) => i.courseNo) },
                },
                sectionNo: { in: cartItems.map((i) => i.sectionNo) },
              },
            },
          });
          if (occupiedSlots.length > 0) {
            const overlapConditions = occupiedSlots.map(
              (slot) =>
                Prisma.sql`(cc.day_of_week = ${slot.dayOfWeek}::day_of_week AND cc.period_start < ${slot.periodEnd} AND ${slot.periodStart} < cc.period_end)`,
            );
            // We want to exclude sections that have ANY class conflicting with ANY occupied slot.
            occupiedSql = Prisma.sql`AND NOT EXISTS (
              SELECT 1 FROM course_class cc
              WHERE cc.section_id = s.id
              AND (${Prisma.join(overlapConditions, " OR ")})
            )`;
          }
        }
      }

      let orderBySql = Prisma.empty;
      const order = sortOrder === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;
      if (sortBy === "NAME") {
        orderBySql = Prisma.sql`ORDER BY ci.abbr_name ${order}, ci.course_name_en ${order}, c.course_no ASC`;
      } else if (sortBy === "CAPACITY_SUM") {
        orderBySql = Prisma.sql`ORDER BY "capacitySum" ${order}, c.course_no ASC`;
      } else {
        orderBySql = Prisma.sql`ORDER BY "remainingSum" ${order}, c.course_no ASC`;
      }

      const totalResult = await prisma.$queryRaw<any[]>(Prisma.sql`
        SELECT COUNT(DISTINCT c.id)::int as total
        FROM course c
        JOIN course_info ci ON c.course_no = ci.course_no
        JOIN course_section s ON s.course_id = c.id
        WHERE c.study_program = ${sqlStudyProgram}::study_program
          AND c.academic_year = ${academicYear}
          AND c.semester = ${sqlSemester}::semester
          ${sqlGenEd ? Prisma.sql`AND c.gen_ed_type = ${sqlGenEd}::gen_ed_type` : Prisma.empty}
          ${faculty ? Prisma.sql`AND ci.faculty = ${faculty}` : Prisma.empty}
          ${sqlGrading ? Prisma.sql`AND ci.grading_type = ${sqlGrading}::grading_type` : Prisma.empty}
          ${noPrereq ? Prisma.sql`AND (c.course_condition IS NULL OR c.course_condition = '' OR c.course_condition = '-')` : Prisma.empty}
          AND (
            ${!q ? Prisma.sql`TRUE` : Prisma.empty}
            ${q ? Prisma.sql`(ci.course_no ILIKE ${searchPattern} OR ci.abbr_name ILIKE ${searchPattern} OR ci.course_name_en ILIKE ${searchPattern} OR ci.course_name_th ILIKE ${searchPattern} OR EXISTS (SELECT 1 FROM course_class cc WHERE cc.section_id = s.id AND cc.professors::text ILIKE ${searchPattern}))` : Prisma.empty}
          )
          AND (
            ${!day && !timeStart && !timeEnd ? Prisma.sql`TRUE` : Prisma.empty}
            ${day || timeStart || timeEnd ? Prisma.sql`EXISTS (SELECT 1 FROM course_class cc WHERE cc.section_id = s.id ${day ? Prisma.sql`AND cc.day_of_week = ${sqlDay}::day_of_week` : Prisma.empty} ${timeStart ? Prisma.sql`AND cc.period_start >= ${timeStart}` : Prisma.empty} ${timeEnd ? Prisma.sql`AND cc.period_end <= ${timeEnd}` : Prisma.empty})` : Prisma.empty}
          )
          ${occupiedSql}
      `);
      const total = totalResult[0]?.total || 0;

      // Step 1: Raw SQL to get filtered and sorted IDs
      const rawResults = await prisma.$queryRaw<any[]>(Prisma.sql`
        SELECT 
          c.id,
          COUNT(DISTINCT s.id)::int as "sectionsCount",
          SUM(s.max)::int as "capacitySum",
          SUM(s.max - s.regis)::int as "remainingSum",
          COUNT(CASE WHEN s.closed THEN 1 END)::int as "closedSectionsCount"
        FROM course c
        JOIN course_info ci ON c.course_no = ci.course_no
        JOIN course_section s ON s.course_id = c.id
        WHERE c.study_program = ${sqlStudyProgram}::study_program
          AND c.academic_year = ${academicYear}
          AND c.semester = ${sqlSemester}::semester
          ${sqlGenEd ? Prisma.sql`AND c.gen_ed_type = ${sqlGenEd}::gen_ed_type` : Prisma.empty}
          ${faculty ? Prisma.sql`AND ci.faculty = ${faculty}` : Prisma.empty}
          ${sqlGrading ? Prisma.sql`AND ci.grading_type = ${sqlGrading}::grading_type` : Prisma.empty}
          ${noPrereq ? Prisma.sql`AND (c.course_condition IS NULL OR c.course_condition = '' OR c.course_condition = '-')` : Prisma.empty}
          
          -- Keyword Search
          AND (
            ${!q ? Prisma.sql`TRUE` : Prisma.empty}
            ${q ? Prisma.sql`(ci.course_no ILIKE ${searchPattern} OR ci.abbr_name ILIKE ${searchPattern} OR ci.course_name_en ILIKE ${searchPattern} OR ci.course_name_th ILIKE ${searchPattern} OR EXISTS (SELECT 1 FROM course_class cc WHERE cc.section_id = s.id AND cc.professors::text ILIKE ${searchPattern}))` : Prisma.empty}
          )

          -- Section level filters
          AND (
            ${!day && !timeStart && !timeEnd ? Prisma.sql`TRUE` : Prisma.empty}
            ${day || timeStart || timeEnd ? Prisma.sql`EXISTS (SELECT 1 FROM course_class cc WHERE cc.section_id = s.id ${day ? Prisma.sql`AND cc.day_of_week = ${sqlDay}::day_of_week` : Prisma.empty} ${timeStart ? Prisma.sql`AND cc.period_start >= ${timeStart}` : Prisma.empty} ${timeEnd ? Prisma.sql`AND cc.period_end <= ${timeEnd}` : Prisma.empty})` : Prisma.empty}
          )

          -- Cart Fit filter
          ${occupiedSql}

        GROUP BY c.id, ci.abbr_name, ci.course_name_en, ci.course_name_th
        ${orderBySql}
        LIMIT ${limit ? Number(limit) : 100}
        OFFSET ${offset ? Number(offset) : 0}
      `);

      if (rawResults.length === 0) {
        return c.json({ data: [] }, 200);
      }

      const courseIds = rawResults.map((r) => r.id);
      const courseList = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        include: {
          courseInfo: true,
          sections: {
            include: { classes: true },
          },
        },
      });

      const courseNos = courseList.map((c) => c.courseNo);
      const reviewCounts = await prisma.review.groupBy({
        by: ["courseNo"],
        _count: { _all: true },
        where: { courseNo: { in: courseNos } },
      });

      const result = rawResults
        .map((raw) => {
          const course = courseList.find((c) => c.id === raw.id);
          if (!course) {
            return null;
          }

          const reviewData = reviewCounts.find(
            (r) => r.courseNo === course.courseNo,
          );

          return {
            course: {
              id: course.id,
              studyProgram: course.studyProgram,
              academicYear: course.academicYear,
              semester: course.semester,
              courseNo: course.courseNo,
              genEdType: course.genEdType,
              midtermStart: course.midtermStart?.toISOString() || null,
              midtermEnd: course.midtermEnd?.toISOString() || null,
              finalStart: course.finalStart?.toISOString() || null,
              finalEnd: course.finalEnd?.toISOString() || null,
              sections: course.sections,
            },
            courseInfo: {
              courseNo: course.courseInfo.courseNo,
              abbrName: course.courseInfo.abbrName,
              courseNameEn: course.courseInfo.courseNameEn,
              courseNameTh: course.courseInfo.courseNameTh,
              courseDescEn: course.courseInfo.courseDescEn,
              courseDescTh: course.courseInfo.courseDescTh,
              faculty: course.courseInfo.faculty || "",
              department: course.courseInfo.department || "",
              credit: course.courseInfo.credit.toString(),
              creditHours: course.courseInfo.creditHours || "",
            },
            stats: {
              sectionsCount: raw.sectionsCount,
              capacitySum: raw.capacitySum,
              remainingSum: raw.remainingSum,
              hasSeats: raw.remainingSum > 0,
              isClosedAll:
                raw.sectionsCount > 0 &&
                raw.closedSectionsCount === raw.sectionsCount,
            },
            reviewCount: reviewData?._count._all || 0, // Extra field for reviews
          };
        })
        .filter(Boolean);

      result.sort((a, b) => {
        const indexA = courseIds.indexOf(a!.course.id);
        const indexB = courseIds.indexOf(b!.course.id);
        return indexA - indexB;
      });

      return c.json({ data: result, total }, 200);
    } catch (err) {
      console.error("Fetch Courses Error:", err);
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 1.2. Get Course Detail
  .openapi(getCourseByNoRoute, async (c) => {
    try {
      const { courseNo } = c.req.valid("param");
      const { studyProgram, academicYear, semester } = c.req.valid("query");

      const course = await prisma.course.findFirst({
        where: {
          courseNo,
          studyProgram: mapStudyProgram(studyProgram),
          academicYear,
          semester: semester ? semesterMap[semester] : undefined,
        },
        include: {
          courseInfo: true,
          sections: { include: { classes: true } },
        },
      });

      if (!course) {
        return c.json({ message: "Course not found" }, 404);
      }

      return c.json(course, 200);
    } catch (err) {
      console.error("Fetch Course Error:", err);
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default courses;
