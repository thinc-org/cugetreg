import { z } from "zod";

import { reviewStatus, semester, studyProgram, vote } from "./constants.js";

export const SubmitReviewResponseSchema = z.object({
  message: z.string().nonempty(),
  data: z.object({
    id: z.string().nonempty(),
    courseNo: z.string().length(7),
    studyProgram: z.enum(studyProgram),
    academicYear: z.coerce.number().int().min(2564),
    semester: z.enum(semester),
    rating: z.int().min(1).max(10),
    content: z.string().nonempty(),
    status: z.enum(reviewStatus),
    likeCount: z.int().min(0),
    dislikeCount: z.int().min(0),
    //myVote: z.enum(vote).nullable(),
    isOwner: z.boolean(),
    createdAt: z.union([z.date(), z.string()]),
  }),
});

export const VoteReviewResponseSchema = z.object({
  message: z.string().nonempty(),
  data: z.object({
    id: z.string().nonempty(),
    likeCount: z.int().min(0),
    dislikeCount: z.int().min(0),
    myInteraction: z.enum(vote).nullable(),
    isOwner: z.boolean(),
  }),
});

export const EditReviewResponseSchema = z.object({
  message: z.string().nonempty(),
  data: z.object({
    id: z.string().nonempty(),
    academicYear: z.coerce.number().int().min(2564),
    semester: z.enum(semester),
    rating: z.int().min(1).max(10),
    content: z.string().nonempty(),
    updatedAt: z.union([z.date(), z.string()]),
    isOwner: z.boolean(),
  }),
});

export const DeleteReviewSchema = z.object({
  message: z.string().nonempty(),
  data: z.object({
    id: z.string().nonempty(),
    status: z.string().nonempty(),
  }),
});
