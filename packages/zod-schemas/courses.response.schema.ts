import { z } from "zod";

import {
  days,
  genEdType,
  reviewStatus,
  semester,
  studyProgram,
  TIME_REGEX,
  vote,
} from "./constants.js";

export const ClassSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  type: z.string(),
  dayOfWeek: days,
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
  genEdType: genEdType,
  classes: z.array(ClassSchema),
});

// 1. Sub-schema for the 'course' object
export const CourseSchema = z.object({
  id: z.string(),
  studyProgram: studyProgram,
  academicYear: z.number().int(),
  semester: semester,
  courseNo: z.string(),
  courseCondition: z.string().nullish().default("-"),
  genEdType: genEdType,
  midtermStart: z.string().datetime().nullable(),
  midtermEnd: z.string().datetime().nullable(),
  finalStart: z.string().datetime().nullable(),
  finalEnd: z.string().datetime().nullable(),
  isFavorite: z.boolean().nullable().default(false),
  sections: z.array(SectionSchema),
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

export const CourseReview = z.object({
  id: z.string(),
  rating: z.number(),
  status: reviewStatus,
  studyProgram: studyProgram,
  academicYear: z.number().min(2564),
  semester: semester,
  sectionNo: z.number().int().nullable().optional(),
  content: z.string(),
  stats: z.object({
    likeCount: z.number(),
    dislikeCount: z.number(),
  }),
  user: z.object({
    faculty: z.string().nullable(),
    department: z.string().nullable(),
  }),
  reaction: vote.optional(),
});

export const CourseNoDetailSchema = CourseSchema.extend({
  courseInfo: CourseInfoSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const CourseNoResponseSchema = z.object({
  course: CourseNoDetailSchema,
});

export const CourseReviewFacetSchema = z.object({
  academicYear: z.number().min(2564),
  semester: semester,
  sectionNo: z.number().int().nullable(),
  count: z.int().min(1),
});

export const CourseSectionsResponseSchema = z.object({
  sections: z.array(z.number().int()),
});

export const CourseReviewResponseSchema = z.object({
  reviews: z.array(CourseReview),
  limit: z.int().min(1),
  page: z.int().min(1),
  count: z.int().min(0),
  facets: z.array(CourseReviewFacetSchema).optional(),
});

export type CourseNoResponse = z.infer<typeof CourseNoResponseSchema>;
export type CourseReview = z.infer<typeof CourseReview>;

export const CourseFavoritesResponseSchema = z.object({
  total: z.number().min(0),
  courses: z.array(
    z.object({
      courseNo: z.string(),
      abbrName: z.string(),
      courseCondition: z.string().nullish().default("-"),
      genEdType: genEdType,
      faculty: z.string().nullable(),
      department: z.string().nullable(),
      credit: z.string(),
      creditHours: z.string().nullable(),
      studyProgram: studyProgram,
      academicYear: z.number().min(2564),
      semester: semester,
    }),
  ),
});

export const AddFavoriteCourseResponseSchema = CourseInfoSchema.omit({
  courseDescEn: true,
  courseDescTh: true,
});

export type CourseReviewFacet = z.infer<typeof CourseReviewFacetSchema>;
export type CourseReviewResponse = z.infer<typeof CourseReviewResponseSchema>;
