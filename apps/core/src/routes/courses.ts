import { OpenAPIHono } from "@hono/zod-openapi";

import { prisma } from "../db/clients.js";
import type { Variables } from "../lib/auth.js";
import {
  getCourseByNoRoute,
  getCoursesRoute,
} from "../routes_define/courses.routes.js";
import { mapGenEdType, mapStudyProgram } from "../utils/enumMapper.js";

// API accepts numeric semester (1/2/3); DB stores enum strings (FIRST/SECOND/SUMMER)
const semesterMap: Record<number, "FIRST" | "SECOND" | "SUMMER"> = {
  1: "FIRST",
  2: "SECOND",
  3: "SUMMER",
};

const courses = new OpenAPIHono<{ Variables: Variables }>();

courses
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
        limit,
      } = c.req.valid("query");

      const courseList = await prisma.course.findMany({
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
        take: limit ? Number(limit) : undefined,
      });

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
