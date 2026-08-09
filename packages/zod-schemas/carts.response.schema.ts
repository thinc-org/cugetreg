import z from "zod";

import { ActivityItemSchema } from "./activity.response.schema.js";
import { genEdType, semester, studyProgram, visible } from "./constants.js";
import { Section } from "./types.js";

export const CartSchema = z.object({
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

export type CartSchema = z.infer<typeof CartSchema>;

export const CartList = z.array(CartSchema);

export const ListCartsResponseSchema = z.object({
  data: CartList,
});

export const SingleCartResponseSchema = z.object({
  data: CartSchema,
});

export const CartItemDetailBaseSchema = z.object({
  id: z.string(),
  courseNo: z.string(),
  sectionNo: z.number(),
  color: z.string().nullable(),
  hidden: z.boolean(),
  cartOrder: z.string(),
  genEdType: genEdType.default("NO"),
  course: z.object({
    abbrName: z.string(),
    courseNameTh: z.string(),
    courseNameEn: z.string(),
    credit: z.string(),
  }),
  sections: z.array(Section).default([]),
});

export type CartItemDetailBase = z.infer<typeof CartItemDetailBaseSchema>;

export const CartWithItemsBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  studyProgram: studyProgram,
  academicYear: z.number(),
  semester: semester,
  items: z.array(CartItemDetailBaseSchema),
});

export type CartWithItemsBase = z.infer<typeof CartWithItemsBaseSchema>;

const CartItemDetailSchema = CartItemDetailBaseSchema.extend({
  isGraded: z.boolean(),
  expectedGrade: z.string(),
});

export const CartData = CartWithItemsBaseSchema.extend({
  visible: z.string(),
  isDefault: z.boolean(),
  cartOrder: z.string(),
  items: z.array(CartItemDetailSchema),
  activityItems: z.array(ActivityItemSchema),
});

export const ClassScheduleItemSchema = z.object({
  cartItemId: z.string(),
  courseNo: z.string(),
  sectionNo: z.number().int(),
  type: z.string(),
  dayOfWeek: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  building: z.string().nullable(),
  room: z.string().nullable(),
  professors: z.array(z.string()),
});

export const ExamScheduleItemSchema = z.object({
  cartItemId: z.string(),
  courseNo: z.string(),
  type: z.enum(["MIDTERM", "FINAL"]),
  start: z.string(),
  end: z.string(),
});

export const ClassConflictSchema = z.object({
  type: z.literal("TIME_OVERLAP"),
  itemIds: z.array(z.string()),
  dayOfWeek: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
});

export const ExamConflictSchema = z.object({
  type: z.literal("EXAM_OVERLAP"),
  itemIds: z.array(z.string()),
  start: z.string(),
  end: z.string(),
});

export type { Period, Section } from "./types.js";
export type CartList = z.infer<typeof CartList>;
export type CartData = z.infer<typeof CartData>;
export type ClassScheduleItem = z.infer<typeof ClassScheduleItemSchema>;
export type ExamScheduleItem = z.infer<typeof ExamScheduleItemSchema>;
export type ClassConflict = z.infer<typeof ClassConflictSchema>;
export type ExamConflict = z.infer<typeof ExamConflictSchema>;
export type CartItemDetail = z.infer<typeof CartItemDetailSchema>;

export const CartDetailResponseSchema = z.object({
  data: z.object({
    cart: CartData,
    summary: z.object({
      totalCredits: z.string(),
      totalVisibleCredits: z.string(),
      totalGradedCredits: z.string(),
      expectedGPA: z.number(),
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

export const SingleCartItemResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    cartId: z.string(),
    courseNo: z.string(),
    sectionNo: z.number(),
    color: z.string().nullable(),
    hidden: z.boolean(),
    cartOrder: z.string(),
    isGraded: z.boolean(),
    expectedGrade: z.string(),
    createdAt: z.union([z.date(), z.string()]),
    updatedAt: z.union([z.date(), z.string()]),
  }),
});
