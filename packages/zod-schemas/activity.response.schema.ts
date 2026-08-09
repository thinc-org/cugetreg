import { z } from "zod";

import { days } from "./constants.js";

export const ActivityItemSchema = z.object({
  id: z.string(),
  cartId: z.string(),
  title: z.string(),
  description: z.string(),
  dayOfWeek: days,
  periodStart: z.string(),
  periodEnd: z.string(),
  color: z.string().nullable(),
  hidden: z.boolean(),
  cartOrder: z.string(),
});

export const SingleActivityResponseSchema = z.object({
  data: ActivityItemSchema,
});

export type ActivityItem = z.infer<typeof ActivityItemSchema>;
