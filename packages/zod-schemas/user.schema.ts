import { z } from "zod";

import { faculty, reviewStatus } from "./constants.js";

export const GetUserReviewsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1),
    limit: z.coerce.number().int().min(1),
    status: reviewStatus.optional(),
  })
  .strict();

export type GetUserReviewsQuery = z.infer<typeof GetUserReviewsQuerySchema>;

export const UpdateUserInfoBodySchema = z.object({
  name: z.string().nonempty(),
  faculty: faculty.optional(),
  department: z.string().optional(),
});

export type UpdateUserInfoBody = z.infer<typeof UpdateUserInfoBodySchema>;
