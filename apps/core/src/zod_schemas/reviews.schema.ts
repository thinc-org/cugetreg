import { z } from "zod";

import { semester, studyProgram, vote } from "./constants.js";

export const SubmitReviewBodySchema = z.object({
  courseNo: z.string().length(7),
  studyProgram: z.enum(studyProgram),
  academicYear: z.coerce.number().int().min(2564),
  semester: z.enum(semester),
  rating: z.coerce.number().int().min(1).max(10),
  content: z.string().nonempty(),
});

export type SubmitReviewBodySchema = z.output<typeof SubmitReviewBodySchema>;

export const VoteReviewBodySchema = z.object({
  interaction: z.enum(vote),
});

export type VoteReviewBodySchema = z.output<typeof VoteReviewBodySchema>;

export const EditReviewBodySchema = z.object({
  academicYear: z.coerce.number().int().min(2564),
  semester: z.enum(semester),
  rating: z.coerce.number().int().min(1).max(10),
  content: z.string().nonempty(),
});

export type EditReviewBodySchema = z.output<typeof EditReviewBodySchema>;
