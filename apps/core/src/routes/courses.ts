import { OpenAPIHono } from "@hono/zod-openapi";
import { Console, Effect } from "effect";

import { prisma } from "../db/clients.js";
import type { Variables } from "../lib/auth.js";
import {
  getCourseByNoRoute,
  getCoursesRoute,
} from "../routes_define/courses.routes.js";

// Map ตัวเลข Semester เป็น Enum
const semesterMap: Record<number, "FIRST" | "SECOND" | "SUMMER"> = {
  1: "FIRST",
  2: "SECOND",
  3: "SUMMER",
};

const courses = new OpenAPIHono<{ Variables: Variables }>();

courses
  .openapi(getCoursesRoute, async (c) => {
    const {
      studyProgram,
      academicYear,
      semester,
      q,
      genEdType,
      faculty,
      sortBy,
      sortOrder,
      limit,
    } = c.req.valid("query");

    const program = Effect.gen(function* () {
      const courses = yield* Effect.tryPromise({
        try: () =>
          prisma.course.findMany({
            where: {
              studyProgram,
              academicYear,
              semester: semester ? semesterMap[semester] : undefined,
              genEdType,
              faculty,
            },
            include: {
              courseInfo: true,
              sections: {
                include: {
                  classes: true,
                },
              },
            },
            orderBy: sortBy
              ? {
                  [sortBy]: sortOrder || "asc",
                }
              : undefined,
            take: limit ? Number(limit) : undefined,
          }),
        catch: (error) => new Error(`Prisma Error:`), // TODO: Handle this
      });

      const courseNos = courses.map((c) => c.courseNo);

      const reviewCounts = yield* Effect.tryPromise({
        try: () =>
          prisma.review.groupBy({
            by: ["courseNo"],
            _count: {
              _all: true,
            },
            where: {
              courseNo: { in: courseNos },
            },
          }),
        catch: (error) => new Error(`Review Count Error:`), // TODO: Handle this
      });

      const result = courses.map((course) => {
        const reviewData = reviewCounts.find(
          (r) => r.courseNo === course.courseNo,
        );
        return {
          ...course,
          reviewCount: reviewData?._count._all || 0,
        };
      });

      return c.json({ data: result }, 200);
    }).pipe(
      Effect.catchAll((err) => {
        return Effect.gen(function* () {
          yield* Console.error("Fetch Courses Error:", err);
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        });
      }),
    );
    return await Effect.runPromise(program);
  })
  .openapi(getCourseByNoRoute, async (c) => {
    const { courseNo } = c.req.valid("param");
    const { studyProgram, academicYear, semester } = c.req.valid("query");

    const program = Effect.gen(function* () {
      const course = yield* Effect.tryPromise({
        try: () =>
          prisma.course.findFirst({
            where: {
              courseNo,
              studyProgram,
              academicYear,
              semester: semester ? semesterMap[semester] : undefined,
            },
            include: {
              courseInfo: true,
              sections: { include: { classes: true } },
            },
          }),
        catch: (e) => new Error("DB Error"),
      });

      if (!course) {
        return c.json({ message: "Course not found" }, 404);
      }

      return c.json(course, 200);
    }).pipe(
      Effect.catchAll((err) => {
        return Effect.gen(function* () {
          yield* Console.error("Fetch Course Error:", err);
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        });
      }),
    );
    return await Effect.runPromise(program);
  });

export default courses;
