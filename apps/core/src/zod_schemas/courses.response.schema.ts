import { z } from "zod";

import {
  days,
  genEdType,
  reviewStatus,
  semesterString,
  studyProgram,
  TIME_REGEX,
} from "./constants.js";
import { courseInfoSchema } from "./courses.schema.js";

export const classSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  type: z.string(),
  dayOfWeek: z.enum(days as [string, ...string[]]),
  periodStart: z.string().regex(TIME_REGEX),
  periodEnd: z.string().regex(TIME_REGEX),
  building: z.string().nullable(),
  room: z.string().nullable(),
  professors: z.array(z.string()),
});

export const sectionSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  sectionNo: z.number().int(),
  closed: z.boolean(),
  regis: z.number().int(),
  max: z.number().int(),
  note: z.string().nullable(),
  genEdType: z.enum(genEdType as [string, ...string[]]),
  classes: z.array(classSchema),
});

export const courseDetailSchema = z.object({
  id: z.string(),
  studyProgram: z.enum(studyProgram as [string, ...string[]]),
  academicYear: z.number().int(),
  semester: z.enum(semesterString as [string, ...string[]]),
  courseNo: z.string(),
  courseCondition: z.string().nullable(),
  midtermStart: z.string().datetime().nullable(),
  midtermEnd: z.string().datetime().nullable(),
  finalStart: z.string().datetime().nullable(),
  finalEnd: z.string().datetime().nullable(),
  genEdType: z.enum(genEdType as [string, ...string[]]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  courseInfo: courseInfoSchema,
  sections: z.array(sectionSchema),
});

export const courseReview = z.object({
  id: z.string(),
  rating: z.number(),
  status: z.enum(reviewStatus as [string, ...string[]]),
  studyProgram: z.enum(studyProgram as [string, ...string[]]),
  academicYear: z.number().min(2564),
  semester: z.enum(semesterString as [string, ...string[]]),
  content: z.string(),
  stats: z.object({
    likeCount: z.number(),
    dislikeCount: z.number(),
  }),
});

export const courseNoResponseSchema = z.object({
  course: courseDetailSchema,
  reviews: z.array(courseReview),
});

export type CourseNoResponse = z.infer<typeof courseNoResponseSchema>;
export type CourseReview = z.infer<typeof courseReview>;
