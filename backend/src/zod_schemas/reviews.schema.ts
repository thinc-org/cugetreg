import {z} from "zod";
import {
  assessment,
  days,
  genEdType,
  sortBy,
  sortOrder,
  studyProgram,
  TIME_REGEX,
} from "./constants.js";

//2.1
export const createReviewRequestSchema = z.object({
  courseNo: z.string(),
  studyProgram: z.string(),
  academicYear: z.number().int(),
  semester: z.string(),
  rating: z.number().int().min(1).max(5),
  content: z.string(),
});

// B. Output Schema (Matches your JSON Response exactly)
export const createReviewResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    courseNo: z.string(),
    studyProgram: z.string(),
    academicYear: z.number().int(),
    semester: z.string(),
    rating: z.number().int(),
    content: z.string(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    likeCount: z.number().int(),
    dislikeCount: z.number().int(),
    myVote: z.enum(["LIKE", "DISLIKE"]).nullable(), // Nullable because user hasn't voted on their own review yet
    isOwner: z.boolean(),
    createdAt: z.string().datetime(),
  }),
});
//2.2
export const reactReviewRequestSchema = z.object({
  // "L" for Like, "D" for Dislike, "N" for None/Clear
  interaction: z.enum(["L", "D", "N"]), 
});

export const reactReviewResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    likeCount: z.number().int(),
    dislikeCount: z.number().int(),
    myInteraction: z.enum(["L", "D", "N"]),
    isOwner: z.boolean(),
  }),
});

// 2.3 Edit Review — Request
export const editReviewRequestSchema = z.object({
  content: z.string(),
});

// 2.3 Edit Review — Response
export const editReviewResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    content: z.string(),
    updatedAt: z.string().datetime(),
    isOwner: z.boolean(),
  }),
});

// 2.4 Delete Review — Response Schema
export const deleteReviewResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    status: z.literal("DELETED"),
  }),
});

