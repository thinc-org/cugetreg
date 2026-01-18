import { z } from "zod";
import {
  assessment,
  days,
  genEdType,
  sortBy,
  sortOrder,
  studyProgram,
  TIME_REGEX,
} from "./constants.js";
//5.1get user information
export const getUserInformationSchema = z.object({
    id: z.string(),
    email: z.string().email,
    name: z.string(),
    google_id: z.string(),
    faculty: z.string(),
    department: z.string(),
    created_at: z.string().datetime,
    updated_at:z.string().datetime,
})

export type UserInformation = z.infer<typeof getUserInformationSchema>;
//5.2get user review

export const reviewSchema = z.object({
  id: z.string(),
  course_no: z.string(),
  academic_year: z.number().int(),
  semester: z.string(),
  rating: z.number().int().min(1).max(5), // Assumes a 1-5 star scale
  content: z.string(),
  status: z.enum(["approved", "pending", "rejected"]), // Using enum for specific statuses
  created_at: z.string().datetime(),
});


export const getReviewsResponseSchema = z.object({
  total_reviews: z.number().int(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  reviews: z.array(reviewSchema),
});

export type ReviewsResponse = z.infer<typeof getReviewsResponseSchema>;
//5.3update user information

export const updateUserProfileResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    image: z.string().url(),
    faculty: z.string(),
    department: z.string(),
    updated_at: z.string().datetime(),
  }),
});

export type UpdateUserProfileResponse = z.infer<typeof updateUserProfileResponseSchema>;