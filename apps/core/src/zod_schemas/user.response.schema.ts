import { z } from "zod";

import { reviewStatus, semester } from "./constants.js";

export const UserResponseSchema = z.object({
  id: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  name: z.string().nonempty(),
  googleId: z.string().regex(/^\d+$/),
  faculty: z.string().nonempty(),
  department: z.string().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

export const UserReviewResponseSchema = z.object({
  totalReviews: z.int().min(0),
  page: z.int().min(1),
  limit: z.int().min(1),
  reviews: z.array(
    z.object({
      id: z.string(),
      courseNo: z.string().regex(/^\d{7}$/),
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
  user: {
    id: z.string().regex(/^\d{10}$/),
    email: z.string().email(),
    name: z.string().nonempty(),
    image: z.string().url(),
    faculty: z.string().nonempty(),
    department: z.string().optional(),
    updatedAt: z.iso.datetime(),
  },
});
