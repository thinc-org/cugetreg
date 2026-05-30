import { OpenAPIHono } from "@hono/zod-openapi";

import { prisma } from "../db/clients.js";
import type { Variables } from "../lib/auth.js";
import {
  getCourseByNoRoute,
  getCoursesRoute,
} from "../routes_define/courses.routes.js";
import { cartService } from "../services/cartsService.js";
import {
  detectClassConflicts,
  detectExamConflicts,
} from "../services/conflictDetection.js";
import {
  mapGenEdType,
  mapSemester,
  mapStudyProgram,
} from "../utils/enumMapper.js";
import type {
  ClassScheduleItem,
  ExamScheduleItem,
} from "../zod_schemas/carts.response.schema.js";

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
        fitCartId,
        limit,
      } = c.req.valid("query");

      let cartSchedule: {
        classes: ClassScheduleItem[];
        exams: ExamScheduleItem[];
      } | null = null;

      if (fitCartId) {
        const userId = c.get("user")?.id;

        if (!userId) {
          return c.json({ error: "UNAUTHORIZED" }, 401);
        }

        const cart = await cartService.getCartDetail(userId, fitCartId);

        if (
          cart.cart.academicYear !== academicYear ||
          mapSemester(semester.toString()) !== cart.cart.semester
        ) {
          return c.json({ error: "INVALID_CONTEXT_PARAMS" }, 400);
        }

        cartSchedule = cart.schedule;
      }

      let courseList = await prisma.course.findMany({
        where: {
          studyProgram: mapStudyProgram(studyProgram),
          academicYear,
          semester: semester ? semesterMap[semester] : undefined,
          genEdType: genEdType ? mapGenEdType(genEdType) : undefined,
          courseInfo: faculty ? { faculty } : undefined,
        },
        include: {
          courseInfo: true,
          sections: { include: { classes: true } },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder || "asc" } : undefined,
        take: fitCartId ? undefined : limit ? Number(limit) : undefined,
      });

      if (cartSchedule) {
        courseList = courseList
          .map((course) => {
            if (course.sections.length === 0) {
              return course;
            }

            const fittingSections = course.sections.filter((section) => {
              const mockClasses: ClassScheduleItem[] = section.classes.map(
                (cls) => ({
                  cartItemId: "new",
                  courseNo: course.courseNo,
                  sectionNo: section.sectionNo,
                  type: cls.type,
                  dayOfWeek: cls.dayOfWeek,
                  periodStart: cls.periodStart,
                  periodEnd: cls.periodEnd,
                  building: cls.building,
                  room: cls.room,
                  professors: cls.professors,
                }),
              );

              const mockExams: ExamScheduleItem[] = [];
              if (course.midtermStart && course.midtermEnd) {
                mockExams.push({
                  cartItemId: "new",
                  courseNo: course.courseNo,
                  type: "MIDTERM",
                  start: course.midtermStart.toISOString(),
                  end: course.midtermEnd.toISOString(),
                });
              }
              if (course.finalStart && course.finalEnd) {
                mockExams.push({
                  cartItemId: "new",
                  courseNo: course.courseNo,
                  type: "FINAL",
                  start: course.finalStart.toISOString(),
                  end: course.finalEnd.toISOString(),
                });
              }

              const classConflicts = detectClassConflicts([
                ...cartSchedule!.classes,
                ...mockClasses,
              ]);
              const examConflicts = detectExamConflicts([
                ...cartSchedule!.exams,
                ...mockExams,
              ]);

              const hasNewClassConflict = classConflicts.some((conf) =>
                conf.itemIds.includes("new"),
              );
              const hasNewExamConflict = examConflicts.some((conf) =>
                conf.itemIds.includes("new"),
              );

              return !hasNewClassConflict && !hasNewExamConflict;
            });

            return { ...course, sections: fittingSections };
          })
          .filter((course) => course.sections.length > 0);

        if (limit) {
          courseList = courseList.slice(0, Number(limit));
        }
      }

      // Attach review counts in a separate GROUP BY query — Prisma can't do this in one query
      const courseNos = courseList.map((c) => c.courseNo);

      const reviewCounts = await prisma.review.groupBy({
        by: ["courseNo"],
        _count: { _all: true },
        where: { courseNo: { in: courseNos } },
      });

      const result = courseList.map((course) => {
        const reviewData = reviewCounts.find(
          (r) => r.courseNo === course.courseNo,
        );
        return { ...course, reviewCount: reviewData?._count._all || 0 };
      });

      return c.json({ data: result }, 200);
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
