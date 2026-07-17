import { z } from "zod";

import {
  CartItemDetailBaseSchema,
  CartWithItemsBaseSchema,
  ClassConflictSchema,
  ClassScheduleItemSchema,
  ExamConflictSchema,
  ExamScheduleItemSchema,
} from "./carts.response.schema.js";
import { semester, studyProgram, visible } from "./constants.js";

export const PublicCartDetailResponseSchema = z.object({
  owner: z.string().optional(),
  data: z.object({
    cart: CartWithItemsBaseSchema,
    summary: z.object({
      totalCredits: z.string(),
    }),
    conflicts: z.object({
      classConflicts: z.array(ClassConflictSchema),
      examConflicts: z.array(ExamConflictSchema),
    }),
    schedule: z.object({
      classes: z.array(ClassScheduleItemSchema),
      exams: z.array(ExamScheduleItemSchema),
    }),
  }),
});

export const PublicCartSchema = z.object({
  id: z.string(),
  userId: z.string(),
  studyProgram: studyProgram,
  academicYear: z.number(),
  semester: semester,
  name: z.string(),
  visible: visible,
  isDefault: z.boolean(),
  cartOrder: z.string(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const ImportPublicCartResponseSchema = z.object({
  data: z.object({
    cart: PublicCartSchema.extend({
      items: z.array(CartItemDetailBaseSchema).optional(),
    }),
  }),
});

export type PublicCartDetail = z.infer<
  typeof PublicCartDetailResponseSchema
>["data"];

export type PublicCartItemDetail = z.infer<typeof CartItemDetailBaseSchema>;
