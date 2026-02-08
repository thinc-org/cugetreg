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
  // 1.1 Get courses
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
      // 1. ดึงรายวิชา (Courses)
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
              courseInfo: true, // เอาชื่อวิชา
              sections: {       // เอา Section ไปคำนวณที่นั่ง
                include: {
                  classes: true // เอาเวลาเรียน
                }
              }
            },
            orderBy: sortBy
              ? {
                  [sortBy]: sortOrder || "asc",
                }
              : undefined,
            take: limit ? Number(limit) : undefined,
          }),
        catch: (error) => new Error(`Prisma Error: ${error}`),
      });

      // 2. ดึงจำนวนรีวิว (Review Counts) แยกต่างหาก
      // เพราะใน Schema ไม่มี Relation Course -> Review
      const courseNos = courses.map((c) => c.courseNo);
      
      const reviewCounts = yield* Effect.tryPromise({
        try: () => 
          prisma.review.groupBy({
            by: ['courseNo'],
            _count: {
              _all: true
            },
            where: {
              courseNo: { in: courseNos }
            }
          }),
        catch: (error) => new Error(`Review Count Error: ${error}`)
      });

      // 3. รวมร่างข้อมูล (Merge)
      const result = courses.map(course => {
        const reviewData = reviewCounts.find(r => r.courseNo === course.courseNo);
        return {
          ...course,
          reviewCount: reviewData?._count._all || 0 // เพิ่ม field นี้เข้าไปเอง
        };
      });

      return c.json({ data: result }, 200);
    }).pipe(
      Effect.catchAll((err) => {
        return Effect.gen(function* () {
          yield* Console.error("Fetch Courses Error:", err);
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        });
      })
    );
    return await Effect.runPromise(program);
  })
  .openapi(getCourseByNoRoute, async (c) => {
    // ... (ส่วน getCourseByNoRoute คงเดิม หรือแก้คล้ายๆ กันถ้าต้องการรีวิว)
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
                sections: { include: { classes: true } }
            }
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
      })
    );
    return await Effect.runPromise(program);
  });

export default courses;