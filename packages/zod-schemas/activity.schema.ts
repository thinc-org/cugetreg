import { z } from "zod";

import { days, TIME_REGEX } from "./constants.js";

export const CreateActivityBodySchema = z
  .object({
    cartId: z.string(),
    title: z.string().nonempty(),
    description: z.string(),
    dayOfWeek: days,
    periodStart: z.string().regex(TIME_REGEX),
    periodEnd: z.string().regex(TIME_REGEX),
    color: z.string().optional(),
    hidden: z.boolean().optional(),
  })
  .strict();

export type CreateActivityBodySchema = z.output<
  typeof CreateActivityBodySchema
>;

export const UpdateActivityBodySchema = z
  .object({
    title: z.string().nonempty().optional(),
    description: z.string().optional(),
    dayOfWeek: days.optional(),
    periodStart: z.string().regex(TIME_REGEX).optional(),
    periodEnd: z.string().regex(TIME_REGEX).optional(),
    color: z.string().optional(),
    hidden: z.boolean().optional(),
    prevId: z.string().optional(),
    nextId: z.string().optional(),
  })
  .strict();

export type UpdateActivityBodySchema = z.output<
  typeof UpdateActivityBodySchema
>;

export const ActivityIdParamSchema = z.object({
  activityId: z.string(),
});

export type ActivityIdParamSchema = z.infer<typeof ActivityIdParamSchema>;
