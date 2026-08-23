import { Prisma } from "@/generated/prisma/client.js";
import type { Variables } from "@/lib/auth.js";
import {
  addFavoriteCourse,
  getCourseByNoRoute,
  getCourseReviews,
  getCourseSectionsRoute,
  getCoursesRoute,
  getFavoriteCourses,
  getLastUpdatedRoute,
  removeFavoriteCourse,
} from "@/routes_define/courses.routes.js";
import { courseServices } from "@/services/coursesService.js";
import { unmapFacultyCode } from "@/utils/enumMapper.js";

import { OpenAPIHono } from "@hono/zod-openapi";

import { middlewareAuth } from "./auth.js";

const courses = new OpenAPIHono<{ Variables: Variables }>();

courses.use("/*/favorite", middlewareAuth);
courses.use("/favorite", middlewareAuth);

courses
  // 1.1. Get Courses
  .openapi(getCoursesRoute, async (c) => {
    try {
      const query = c.req.valid("query");
      const user = c.get("user");
      const result = await courseServices.queryCourse(query, user?.id);
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

  //1.2 Get favorite courses
  .openapi(getFavoriteCourses, async (c) => {
    try {
      const userId = c.get("user")?.id;
      const query = c.req.valid("query");
      const data = await courseServices.getFavoriteCourses(query, userId);
      return c.json(data, 200);
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  //1.2b Get last course data sync timestamp
  // Must be registered before 1.3 (path "/{courseNo}") — otherwise the
  // dynamic param route matches "/last-updated" first and shadows this one.
  .openapi(getLastUpdatedRoute, async (c) => {
    try {
      const { studyProgram, academicYear, semester } = c.req.valid("query");
      const data = await courseServices.getLastUpdated({
        studyProgram,
        academicYear,
        semester,
      });
      return c.json(data, 200);
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 1.3. Get Course Detail
  .openapi(getCourseByNoRoute, async (c) => {
    try {
      const { courseNo } = c.req.valid("param");
      const { studyProgram, academicYear, semester } = c.req.valid("query");
      const userId = c.get("user")?.id;

      const query = { studyProgram, academicYear, semester };

      const { course } = await courseServices.getCourseDetail(query, courseNo);

      return c.json(
        {
          course: {
            ...course,
            courseInfo: {
              ...course.courseInfo,
              faculty: unmapFacultyCode(course.courseInfo.faculty),
            },
          },
        },
        200,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message === "Course not found") {
          return c.json({ message: "Course not found" }, 404);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  //1.4 Add favorite course
  .openapi(addFavoriteCourse, async (c) => {
    try {
      const { courseNo } = c.req.valid("param");
      const userId = c.get("user")?.id;

      const data = await courseServices.addFavoriteCourse(courseNo, userId);

      return c.json(data, 201);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "COURSE_NOT_FOUND") {
          return c.json({ error: e.message }, 404);
        }
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          return c.body(null, 204);
        }
      }

      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  //1.5 Remove favorite course
  .openapi(removeFavoriteCourse, async (c) => {
    try {
      const { courseNo } = c.req.valid("param");
      const userId = c.get("user")?.id;
      await courseServices.removeFavoriteCourse(courseNo, userId);
      return c.body(null, 204);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "COURSE_NOT_FOUND") {
          return c.json({ error: e.message }, 404);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  // 1.6. Get Course Sections (lightweight — Section picker on the review form)
  .openapi(getCourseSectionsRoute, async (c) => {
    try {
      const { courseNo } = c.req.valid("param");
      const { studyProgram, academicYear, semester } = c.req.valid("query");

      const courseSections = await courseServices.getCourseSections(courseNo, {
        studyProgram,
        academicYear,
        semester,
      });

      return c.json(courseSections, 200);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message === "Course not found") {
          return c.json({ message: "Course not found" }, 404);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  // 1.7. Get Course Reviews
  .openapi(getCourseReviews, async (c) => {
    try {
      const { courseNo } = c.req.valid("param");
      const query = c.req.valid("query");
      const userId = c.get("user")?.id;
      const { reviews, count, facets } =
        await courseServices.getCourseReviewByCourseNo(courseNo, query, userId);
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
