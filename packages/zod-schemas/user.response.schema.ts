import { z } from "zod";

import {
  faculty,
  genEdType,
  reviewStatus,
  semester,
  studyProgram,
  vote,
} from "./constants.js";

export const UserResponseSchema = z.object({
  id: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  name: z.string().nonempty(),
  googleId: z.string().regex(/^\d+$/),
  faculty: faculty.nullable(),
  department: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const UserInputSchema = UserResponseSchema.partial({
  googleId: true,
  createdAt: true,
  updatedAt: true,
});

export type UserInputSchema = z.infer<typeof UserInputSchema>;

export const UserReviewResponseSchema = z.object({
  totalReviews: z.int().min(0),
  page: z.int().min(1),
  limit: z.int().min(1),
  ratingHistories: z.array(z.int()).length(10).optional(),
  reviews: z.array(
    z.object({
      id: z.string(),
      courseNo: z.string().regex(/^\d{7}$/),
      courseAbbrName: z.string().nonempty(),
      genEdType: genEdType,
      studyProgram: studyProgram,
      academicYear: z.int().min(2564),
      semester: semester,
      sectionNo: z.int().nullable().optional(),
      rejectionReason: z.string().nullable(),
      rating: z.int().min(1).max(10),
      content: z.string().nonempty(),
      status: reviewStatus,
      stats: z
        .object({
          likeCount: z.number(),
          dislikeCount: z.number(),
        })
        .optional(),
      reaction: vote.optional(),
      createdAt: z.iso.datetime(),
    }),
  ),
});

export type ReviewSchema = z.infer<
  typeof UserReviewResponseSchema.shape.reviews.element
>;

export const UpdateUserInfoResponseSchema = z.object({
  message: z.string().nonempty(),
  user: z.object({
    id: z.string().regex(/^\d{10}$/),
    email: z.string().email(),
    name: z.string().nonempty(),
    image: z.string().url().nullable(),
    faculty: faculty.nullable(),
    department: z.string().nullable(),
    updatedAt: z.iso.datetime(),
  }),
});
