import { z } from "zod";

import {
  days,
  genEdType,
  reviewStatus,
  semesterString,
  studyProgram,
  TIME_REGEX,
} from "./constants.js";
import { CourseInfoSchema } from "./courses.schema.js";

export const ClassSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  type: z.string(),
  dayOfWeek: z.enum(days),
  periodStart: z.string().regex(TIME_REGEX),
  periodEnd: z.string().regex(TIME_REGEX),
  building: z.string().nullable(),
  room: z.string().nullable(),
  professors: z.array(z.string()),
});

export const SectionSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  sectionNo: z.number().int(),
  closed: z.boolean(),
  regis: z.number().int(),
  max: z.number().int(),
  note: z.string().nullable(),
  genEdType: z.enum(genEdType),
  classes: z.array(ClassSchema),
});

export const CourseDetailSchema = z.object({
  id: z.string(),
  studyProgram: z.enum(studyProgram),
  academicYear: z.number().int(),
  semester: z.enum(semesterString),
  courseNo: z.string(),
  courseCondition: z.string().nullable(),
  midtermStart: z.string().datetime().nullable(),
  midtermEnd: z.string().datetime().nullable(),
  finalStart: z.string().datetime().nullable(),
  finalEnd: z.string().datetime().nullable(),
  genEdType: z.enum(genEdType),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  courseInfo: CourseInfoSchema,
  sections: z.array(SectionSchema),
});

export const CourseReview = z.object({
  id: z.string(),
  rating: z.number(),
  status: z.enum(reviewStatus),
  studyProgram: z.enum(studyProgram),
  academicYear: z.number().min(2564),
  semester: z.enum(semesterString),
  content: z.string(),
  stats: z.object({
    likeCount: z.number(),
    dislikeCount: z.number(),
  }),
});

export const CourseNoResponseSchema = z.object({
  course: CourseDetailSchema,
  reviews: z.array(CourseReview),
});

export type CourseNoResponse = z.infer<typeof CourseNoResponseSchema>;
export type CourseReview = z.infer<typeof CourseReview>;
