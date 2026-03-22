import { z } from "zod";

import {
  ClassConflictSchema,
  ClassScheduleItemSchema,
  ExamConflictSchema,
  ExamScheduleItemSchema,
  Section,
} from "./carts.response.schema.js";

const PublicCartItemDetailSchema = z.object({
  id: z.string(),
  courseNo: z.string(),
  sectionNo: z.number(),
  color: z.string().nullable(),
  hidden: z.boolean(),
  cartOrder: z.string(),
  course: z.object({
    courseNameTh: z.string(),
    courseNameEn: z.string(),
    credit: z.string(),
  }),
  // section: z
  //   .object({
  //     closed: z.boolean(),
  //     regis: z.number(),
  //     max: z.number(),
  //     note: z.string().nullable(),
  //   })
  //   .nullable(),
  sections: z.array(Section),
});

export const PublicCartDetailResponseSchema = z.object({
  data: z.object({
    cart: z.object({
      id: z.string(),
      name: z.string(),
      studyProgram: z.string(),
      academicYear: z.number(),
      semester: z.string(),
      items: z.array(PublicCartItemDetailSchema),
    }),
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

export const CartSchema = z.object({
  id: z.string(),
  userId: z.string(),
  studyProgram: z.string(),
  academicYear: z.number(),
  semester: z.string(),
  name: z.string(),
  visible: z.string(),
  isDefault: z.boolean(),
  cartOrder: z.string(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export const ImportPublicCartResponseSchema = z.object({
  data: z.object({
    cart: CartSchema.extend({
      items: z.array(z.any()).optional(),
    }),
  }),
});

const CartItemDetailSchema = z.object({
  id: z.string(),
  courseNo: z.string(),
  sectionNo: z.number(),
  color: z.string().nullable(),
  hidden: z.boolean(),
  cartOrder: z.string(),
  isGraded: z.boolean(),
  expectedGrade: z.string(),
  course: z.object({
    courseNameTh: z.string(),
    courseNameEn: z.string(),
    credit: z.string(),
  }),
  section: z
    .object({
      closed: z.boolean(),
      regis: z.number(),
      max: z.number(),
      note: z.string().nullable(),
    })
    .nullable(),
});

export type PublicCartItemDetail = z.infer<typeof PublicCartItemDetailSchema>;
