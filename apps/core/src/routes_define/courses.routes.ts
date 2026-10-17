import { createRoute } from "@hono/zod-openapi";

import * as CourseSchema from "@cugetreg/zod-schemas/courses";
import * as CourseResponseSchema from "@cugetreg/zod-schemas/courses-response";

import { errorRes, InternalError } from "./errorRes.js";

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
          schema: CourseResponseSchema.GetCourseResponseSchema,
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

//1.2 Get favorite courses
export const getFavoriteCourses = createRoute({
  method: "get",
  path: "/favorite",
  summary: "1.2 Get User's Favorite Courses",
  request: {
    query: CourseSchema.GetCourseDetailQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CourseResponseSchema.CourseFavoritesResponseSchema,
        },
      },
      description: "OK",
    },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

//1.3 get course detail by id
export const getCourseByNoRoute = createRoute({
  method: "get",
  path: "/{courseNo}", // Use curly braces for OpenAPI / Hono path params
  summary: "1.3 Get Course by Course Number",
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

//1.4 add favorite course
export const addFavoriteCourse = createRoute({
  method: "put",
  path: "/{courseNo}/favorite",
  summary: "1.4 Add New Favorite Course By Course Number",
  request: {
    params: CourseSchema.CourseNoParamSchema,
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: CourseResponseSchema.AddFavoriteCourseResponseSchema,
        },
      },
      description: "Created",
    },
    204: { description: "No content, this course is already your favorite" },
    404: errorRes("COURSE_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

//1.5 remove favorite course
export const removeFavoriteCourse = createRoute({
  method: "delete",
  path: "/{courseNo}/favorite",
  summary: "1.5 Remove Favorite Course By Course Number",
  request: {
    params: CourseSchema.CourseNoParamSchema,
  },
  responses: {
    204: { description: "Deleted" },
    404: errorRes("COURSE_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 1.5b get last-synced timestamp (public — no auth required)
export const getLastUpdatedRoute = createRoute({
  method: "get",
  path: "/last-updated",
  summary: "1.5b Get Last Course Data Sync Timestamp",
  request: {
    query: CourseSchema.GetCourseDetailQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CourseResponseSchema.LastUpdatedResponseSchema,
        },
      },
      description: "OK",
    },
    500: InternalError,
  },
});

// 1.6 get course sections (lightweight — for the review form's Section picker)
export const getCourseSectionsRoute = createRoute({
  method: "get",
  path: "/{courseNo}/sections",
  summary: "1.6 Get Course Sections",
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
  summary: "1.7 Get Course reviews",
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
