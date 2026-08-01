import { createRoute } from "@hono/zod-openapi";

import * as CourseSchema from "@cugetreg/zod-schemas/courses";
import * as CourseResponseSchema from "@cugetreg/zod-schemas/courses-response";

import { InternalError } from "./errorRes.js";

//1.1get courses
export const getCoursesRoute = createRoute({
  method: "get",
  path: "/",
  summary: "1.1 Get Courses",
  request: { query: CourseSchema.GetCourseQuerySchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CourseResponseSchema.CourseDetailsSchema,
        },
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

// 1.4 get course sections (lightweight — for the review form's Section picker)
export const getCourseSectionsRoute = createRoute({
  method: "get",
  path: "/{courseNo}/sections",
  summary: "1.4 Get Course Sections",
  request: {
    params: CourseSchema.CourseNoParamSchema,
    query: CourseSchema.GetCourseSectionsQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CourseResponseSchema.CourseSectionsResponseSchema,
        },
      },
      description: "Successfully retrieved course section numbers",
    },
    400: { description: "Invalid course number format" },
    404: { description: "Course not found" },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

export const getCourseReviews = createRoute({
  method: "get",
  path: "/reviews/{courseNo}",
  summary: "1.3 Get Course reviews",
  request: {
    params: CourseSchema.GetCourseReviewParamSchema,
    query: CourseSchema.GetCourseReviewQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CourseResponseSchema.CourseReviewResponseSchema,
        },
      },
      description: "Successfully retrieved course details",
    },
    400: { description: "Invalid course number format" },
    404: { description: "Course not found" },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
