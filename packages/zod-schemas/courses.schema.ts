import { z } from "zod";

import {
  assessment,
  days,
  faculty,
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
  faculties: z.union([faculty, z.array(faculty)]).optional(),
  days: z.union([z.array(days), days]).optional(),
  timeStart: z.string().regex(TIME_REGEX).optional(),
  timeEnd: z.string().regex(TIME_REGEX).optional(),
  creditMin: z.coerce.number().optional(),
  creditMax: z.coerce.number().optional(),
  noPrereq: z.coerce.boolean().optional(),
  favorite: z.coerce.boolean().optional(),
  fitCartId: z.string().optional(),
  assessment: z.union([z.array(assessment), assessment]).optional(),
  sortBy: sortBy.optional(),
  sortOrder: sortOrder.optional(),
  offset: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().optional(),
});

//1.3 get course detail by id
// In your schema file
export const CourseNoParamSchema = z.object({
  courseNo: z
    .string()
    .regex(/^\d{7}$/)
    .describe("The registration number of the course"),
});

export const GetCourseReviewParamSchema = z.object({
  courseNo: z.string().length(7),
});

export const GetCourseReviewQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  academicYear: z.coerce.number().int().min(2564).optional(),
  semester: semester.optional(),
  sectionNo: z.coerce.number().int().optional(),
  includeFacets: z.stringbool().default(false),
});

//1.6 get course sections (lightweight — section numbers only, used to
// populate the Section picker on the review form for a given year/semester)
export const GetCourseSectionsQuerySchema = z.object({
  studyProgram: studyProgram,
  academicYear: z.coerce.number().int().min(2564),
  semester: semester,
});

export type GetCourseQuerySchema = z.infer<typeof GetCourseQuerySchema>;

export const GetCourseDetailQuerySchema = GetCourseQuerySchema.pick({
  studyProgram: true,
  academicYear: true,
  semester: true,
});

export type GetCourseDetailQuerySchema = z.infer<
  typeof GetCourseDetailQuerySchema
>;
export type GetCourseReviewQuerySchema = z.infer<
  typeof GetCourseReviewQuerySchema
>;
export type GetCourseSectionsQuerySchema = z.infer<
  typeof GetCourseSectionsQuerySchema
>;
