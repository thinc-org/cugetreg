import { prisma } from "@/db/clients.js";
import type { Variables } from "@/lib/auth.js";
import {
  getCourseByNoRoute,
  getCourseReviews,
  getCoursesRoute,
} from "@/routes_define/courses.routes.js";
import {
  getCourseReviewByCourseNo,
  queryCourse,
} from "@/services/coursesService.js";
import { mapSemester, mapStudyProgram } from "@/utils/enumMapper.js";

import { OpenAPIHono } from "@hono/zod-openapi";

const courses = new OpenAPIHono<{ Variables: Variables }>();

courses
  // 1.1. Get Courses
  .openapi(getCoursesRoute, async (c) => {
    try {
      const query = c.req.valid("query");
      const user = c.get("user");
      const result = await queryCourse(query, user?.id);
      return c.json(result, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "UNAUTHORIZED") {
          return c.json({ error: "UNAUTHORIZED" }, 401);
        }
        if (
          err.message === "CART_DOES_NOT_EXIST" ||
          err.message === "NOT_CART_OWNER"
        ) {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
      }
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
          semester: mapSemester(semester),
        },
        include: {
          courseInfo: true,
          sections: { include: { classes: true } },
        },
      });

      if (!course) {
        return c.json({ message: "Course not found" }, 404);
      }

      return c.json(
        {
          course,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  .openapi(getCourseReviews, async (c) => {
    try {
      const { courseNo } = c.req.valid("param");
      const query = c.req.valid("query");
      const userId = c.get("user")?.id;
      const { reviews, count, facets } = await getCourseReviewByCourseNo(
        courseNo,
        query,
        userId,
      );
      return c.json({
        reviews,
        page: query.page,
        limit: query.limit,
        count,
        ...(facets && { facets }),
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "COURSE_NOT_FOUND") {
          return c.json({ error: "COURSE_NOT_FOUND" }, 404);
        }
      }
      console.error("Fetch Courses Error:", err);
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default courses;
