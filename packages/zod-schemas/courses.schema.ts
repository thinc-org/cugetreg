import { z } from "zod";

import {
  assessment,
  days,
  genEdType,
  semester,
  sortBy,
  sortOrder,
  studyProgram,
  TIME_REGEX,
} from "./constants.js";

//1.1 get courses
export const GetCourseQuerySchema = z.object({
  studyProgram: studyProgram,
  academicYear: z.coerce.number().int().min(2564),
  semester: semester,
  q: z.string().optional(),
  genEdTypes: z.union([z.array(genEdType), genEdType]).optional(),
  faculties: z.union([z.string(), z.array(z.string())]).optional(),
  days: z.union([z.array(days), days]).optional(),
  timeStart: z.string().regex(TIME_REGEX).optional(),
  timeEnd: z.string().regex(TIME_REGEX).optional(),
  creditMin: z.coerce.number().optional(),
  creditMax: z.coerce.number().optional(),
  noPrereq: z.coerce.boolean().optional(),
  fitCartId: z.string().optional(),
  assessment: assessment.optional(),
  sortBy: sortBy.optional(),
  sortOrder: sortOrder.optional(),
  offset: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().optional(),
});

//1.2 get course detail by id
// In your schema file
export const CourseNoParamSchema = z.object({
  courseNo: z.string().describe("The registration number of the course"),
});

export const GetCourseReviewParamSchema = z.object({
  courseNo: z.string().length(7),
});

export const GetCourseReviewQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  academicYear: z.coerce.number().int().min(2564).optional(),
  semester: semester.optional(),
  includeFacets: z.stringbool().default(false),
});

export type GetCourseQuerySchema = z.infer<typeof GetCourseQuerySchema>;
export type GetCourseReviewQuerySchema = z.infer<
  typeof GetCourseReviewQuerySchema
>;
