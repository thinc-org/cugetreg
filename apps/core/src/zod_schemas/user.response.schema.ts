import { z } from "zod";

import { reviewStatus, semester, studyProgram } from "./constants.js";

export const UserResponseSchema = z.object({
  id: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  name: z.string().nonempty(),
  googleId: z.string().regex(/^\d+$/),
  faculty: z.string().nullable(),
  department: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const UserReviewResponseSchema = z.object({
  totalReviews: z.int().min(0),
  page: z.int().min(1),
  limit: z.int().min(1),
  reviews: z.array(
    z.object({
      id: z.string(),
      courseNo: z.string().regex(/^\d{7}$/),
      studyProgram: z.enum(studyProgram),
      academicYear: z.int().min(2564),
      semester: z.enum(semester),
      rating: z.int().min(1).max(10),
      content: z.string().nonempty(),
      status: z.enum(reviewStatus),
      createdAt: z.iso.datetime(),
    }),
  ),
});

export const UpdateUserInfoResponseSchema = z.object({
  message: z.string().nonempty(),
  user: z.object({
    id: z.string().regex(/^\d{10}$/),
    email: z.string().email(),
    name: z.string().nonempty(),
    image: z.string().url().nullable(),
    faculty: z.string().nullable(),
    department: z.string().nullable(),
    updatedAt: z.iso.datetime(),
  }),
});
