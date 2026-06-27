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
  genEdType: genEdType.optional(),
  faculty: z.string().optional(),
  day: days.optional(),
  timeStart: z.string().regex(TIME_REGEX).optional(),
  timeEnd: z.string().regex(TIME_REGEX).optional(),
  noPrereq: z.coerce.boolean().optional(),
  fitCartId: z.string().optional(),
  assessment: assessment.optional(),
  sortBy: sortBy.optional(),
  sortOrder: sortOrder.optional(),
  offset: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().optional(),
});
// 1. Sub-schema for the 'course' object
export const CourseSchema = z.object({
  id: z.string(),
  studyProgram: z.string(),
  academicYear: z.number().int(),
  semester: z.string(),
  courseNo: z.string(),
  genEdType: z.string(),
  midtermStart: z.string().datetime().nullable(),
  midtermEnd: z.string().datetime().nullable(),
  finalStart: z.string().datetime().nullable(),
  finalEnd: z.string().datetime().nullable(),
  sections: z.any().array().optional(),
});

// 2. Sub-schema for the 'courseInfo' object
export const CourseInfoSchema = z.object({
  abbrName: z.string(),
  courseNameEn: z.string(),
  courseNameTh: z.string(),
  courseDescEn: z.string().nullable(),
  courseDescTh: z.string().nullable(),
  faculty: z.string().nullable(),
  department: z.string().nullable(),
  credit: z.string(),
  creditHours: z.string().nullable(),
});

// 3. Sub-schema for the 'stats' object
const StatsSchema = z.object({
  sectionsCount: z.number().int(),
  capacitySum: z.number().int(),
  remainingSum: z.number().int(),
  hasSeats: z.boolean(),
  isClosedAll: z.boolean(),
});

// 4. The Main Schema combining everything
export const CourseDetailsSchema = z.object({
  course: CourseSchema,
  courseInfo: CourseInfoSchema,
  stats: StatsSchema,
  fitMySchedule: z.boolean(),
});
//1.2 get course detail by id
// In your schema file
export const CourseNoParamSchema = z.object({
  courseNo: z.string().describe("The registration number of the course"),
});

export type GetCourseQuerySchema = z.infer<typeof GetCourseQuerySchema>;
