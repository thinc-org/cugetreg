import z from "zod";

import { semester } from "./constants.js";

export const StudyPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  curriculumId: z.string().nullable(),
  isDefault: z.boolean(),
  extraTerms: z.number(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type StudyPlanSchema = z.infer<typeof StudyPlanSchema>;

export const ListStudyPlansResponseSchema = z.object({
  data: z.array(StudyPlanSchema),
});

export const SingleStudyPlanResponseSchema = z.object({
  data: StudyPlanSchema,
});

export const PlanCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  curriculumCategoryId: z.string().nullable(),
});

export const CustomCreditTargetSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  yearOfStudy: z.number().nullable(),
  semester: semester.nullable(),
  targetCredit: z.number(),
});

export const SingleCustomCreditTargetResponseSchema = z.object({
  data: CustomCreditTargetSchema,
});

export const PlanItemSchema = z.object({
  id: z.string(),
  courseNo: z.string(),
  yearOfStudy: z.number(),
  semester: semester,
  categoryId: z.string(),
  requirementId: z.string().nullable(),
  isGraded: z.boolean(),
  expectedGrade: z.string(),
  itemOrder: z.string(),
  course: z.object({
    abbrName: z.string(),
    courseNameTh: z.string(),
    courseNameEn: z.string(),
    credit: z.string(),
  }),
});

export const SinglePlanItemResponseSchema = z.object({
  data: PlanItemSchema,
});

export const StudyPlanDetailResponseSchema = z.object({
  data: z.object({
    plan: StudyPlanSchema,
    categories: z.array(PlanCategorySchema),
    creditTargets: z.array(CustomCreditTargetSchema),
    items: z.array(PlanItemSchema),
  }),
});

export const CartCandidateItemSchema = z.object({
  cartItemId: z.string(),
  cartId: z.string(),
  cartName: z.string(),
  academicYear: z.number(),
  courseNo: z.string(),
  abbrName: z.string(),
  courseNameTh: z.string(),
  courseNameEn: z.string(),
  credit: z.string(),
});

export const CartCandidatesResponseSchema = z.object({
  data: z.array(CartCandidateItemSchema),
});

export const AddPlanItemsFromCartResponseSchema = z.object({
  data: z.object({
    added: z.array(PlanItemSchema),
    skipped: z.array(
      z.object({ courseNo: z.string(), reason: z.literal("ALREADY_IN_PLAN") }),
    ),
  }),
});

export const TermGradeSchema = z.object({
  yearOfStudy: z.number(),
  semester: semester,
  items: z.array(
    z.object({
      id: z.string(),
      courseNo: z.string(),
      courseNameTh: z.string(),
      courseNameEn: z.string(),
      credit: z.string(),
      isGraded: z.boolean(),
      expectedGrade: z.string(),
    }),
  ),
  termCredit: z.string(),
  termGpa: z.number().nullable(),
});

export const StudyPlanGradesResponseSchema = z.object({
  data: z.object({
    terms: z.array(TermGradeSchema),
    totalCredit: z.string(),
    totalGradedCredit: z.string(),
    gpax: z.number().nullable(),
  }),
});

export type PlanCategory = z.infer<typeof PlanCategorySchema>;
export type CustomCreditTarget = z.infer<typeof CustomCreditTargetSchema>;
export type PlanItem = z.infer<typeof PlanItemSchema>;
export type CartCandidateItem = z.infer<typeof CartCandidateItemSchema>;
export type TermGrade = z.infer<typeof TermGradeSchema>;
