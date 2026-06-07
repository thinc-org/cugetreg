import { createRoute } from "@hono/zod-openapi";

import { InternalError } from "./errorRes.js";

import * as CourseSchema from "@cugetreg/zod-schemas/courses";
import * as CourseResponseSchema from "@cugetreg/zod-schemas/courses-response";

//1.1get courses
export const getCoursesRoute = createRoute({
  method: "get",
  path: "/",
  summary: "1.1 Get Courses",
  request: { query: CourseSchema.GetCourseQuerySchema },
  responses: {
    200: {
      content: {
        "application/json": { schema: CourseSchema.CourseDetailsSchema },
      },
      description: "OK",
    },
    400: { description: "Invalid course number format" },
    401: { description: "Unauthorized - Missing or invalid token" },
    404: { description: "Course not found" },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
//1.2 get course detail by id
export const getCourseByNoRoute = createRoute({
  method: "get",
  path: "/{courseNo}", // Use curly braces for OpenAPI / Hono path params
  summary: "1.2 Get Course by Course Number",
  request: {
    params: CourseSchema.CourseNoParamSchema,
    query: CourseSchema.GetCourseQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CourseResponseSchema.CourseNoResponseSchema,
        },
      },
      description: "Successfully retrieved course details",
    },
    400: { description: "Invalid course number format" },
    401: { description: "Unauthorized - Missing or invalid token" },
    404: { description: "Course not found" },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
