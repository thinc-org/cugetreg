import z from "zod";

import { semester } from "./constants.js";

export const CreateStudyPlanBodySchema = z
  .object({
    name: z.string().nonempty(),
    // Omit to create a custom plan with no curriculum. Immutable after creation.
    curriculumId: z.string().optional(),
  })
  .strict();

export type CreateStudyPlanBodySchema = z.output<
  typeof CreateStudyPlanBodySchema
>;

export const UpdateStudyPlanBodySchema = z
  .object({
    name: z.string().nonempty(),
  })
  .strict();

export type UpdateStudyPlanBodySchema = z.output<
  typeof UpdateStudyPlanBodySchema
>;

export const UpdateCustomCreditTargetBodySchema = z
  .object({
    targetCredit: z.number().int().min(0),
  })
  .strict();

export type UpdateCustomCreditTargetBodySchema = z.output<
  typeof UpdateCustomCreditTargetBodySchema
>;

export const AddPlanItemBodySchema = z
  .object({
    courseNo: z
      .string()
      .trim()
      .length(7)
      .regex(/^[0-9]+$/),
    yearOfStudy: z.number().int().min(1),
    semester: semester,
    categoryId: z.string(),
  })
  .strict();

export type AddPlanItemBodySchema = z.output<typeof AddPlanItemBodySchema>;

export const CartCandidatesQuerySchema = z
  .object({
    semester: semester,
  })
  .strict();

export type CartCandidatesQuerySchema = z.output<
  typeof CartCandidatesQuerySchema
>;

export const AddPlanItemsFromCartBodySchema = z
  .object({
    yearOfStudy: z.number().int().min(1),
    semester: semester,
    categoryId: z.string(),
    cartItemIds: z.array(z.string()).nonempty(),
  })
  .strict();

export type AddPlanItemsFromCartBodySchema = z.output<
  typeof AddPlanItemsFromCartBodySchema
>;

const gradeValue = z
  .number()
  .min(0)
  .max(4)
  .refine((n) => n % 0.5 === 0, { message: "Grade must be a multiple of 0.5" });

export const UpdateGradesBodySchema = z
  .object({
    items: z
      .array(
        z
          .object({
            itemId: z.string(),
            isGraded: z.boolean(),
            expectedGrade: gradeValue,
          })
          .strict(),
      )
      .nonempty(),
  })
  .strict();

export type UpdateGradesBodySchema = z.output<typeof UpdateGradesBodySchema>;
