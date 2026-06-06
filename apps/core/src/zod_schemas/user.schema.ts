import { z } from "zod";

import { reviewStatus } from "./constants.js";

export const GetUserReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1),
  status: z.enum(reviewStatus),
});

export const UpdateUserInfoBodySchema = z.object({
  name: z.string().nonempty(),
  faculty: z.string().nonempty(),
  department: z.string().optional(),
});
