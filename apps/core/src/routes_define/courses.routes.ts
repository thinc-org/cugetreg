import { createRoute } from "@hono/zod-openapi";

import { InternalError } from "./errorRes.js";

import * as CourseSchema from "../zod_schemas/courses.schema.js";

//1.1get courses
export const getCoursesRoute = createRoute({
  method: "get",
  path: "/",
  summary: "1.1 Get Courses",
  request: { query: CourseSchema.getCourseQuerySchema },
  responses: {
    200: {
      content: {
        "application/json": { schema: CourseSchema.courseDetailsSchema },
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
    params: CourseSchema.courseNoParamSchema,
    query: CourseSchema.getCourseQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: CourseSchema.courseDetailsSchema },
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
