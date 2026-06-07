import z from "zod";

import { semesterString, studyProgram, visible } from "./constants.js";

export const ListCartsQuerySchema = z
  .object({
    academicYear: z.coerce.number().int().optional(),
    semester: z.enum(semesterString).optional(),
    studyProgram: z.enum(studyProgram).optional(),
  })
  .strict();

export type ListCartsQuerySchema = z.output<typeof ListCartsQuerySchema>;

export const CreateCartBodySchema = z
  .object({
    academicYear: z.number().int().min(2564),
    semester: z.enum(semesterString),
    studyProgram: z.enum(studyProgram),
    name: z.string().nonempty(),
    isDefault: z.boolean(),
  })
  .strict();

export type CreateCartBodySchema = z.output<typeof CreateCartBodySchema>;

export const UpdateCartBodySchema = z
  .object({
    name: z.string().nonempty().optional(),
    visible: z.enum(visible).optional(),
    isDefault: z.boolean().optional(),
    prevId: z.string().optional(),
    nextId: z.string().optional(),
  })
  .strict();

export type UpdateCartBodySchema = z.output<typeof UpdateCartBodySchema>;

export const AddCourseBodySchema = z
  .object({
    courseNo: z
      .string()
      .trim()
      .length(7)
      .regex(/^[0-9]+$/),
    sectionNo: z.number().int(),
    color: z.string().optional(),
    isGraded: z.boolean().optional(),
    expectedGrade: z
      .number()
      .min(0)
      .max(4)
      .refine((n) => n % 0.5 === 0, {
        message: "Grade must be a multiple of 0.5",
      })
      .optional(),
    hidden: z.boolean().optional(),
  })
  .strict();

export type AddCourseBodySchema = z.output<typeof AddCourseBodySchema>;

export const UpdateCourseBodySchema = z
  .object({
    sectionNo: z.number().int().optional(),
    color: z.string().optional(),
    hidden: z.boolean().optional(),
    isGraded: z.boolean().optional(),
    expectedGrade: z
      .number()
      .min(0)
      .max(4)
      .refine((n) => n % 0.5 === 0, {
        message: "Grade must be a multiple of 0.5",
      })
      .optional(),
    prevId: z.string().optional(),
    nextId: z.string().optional(),
  })
  .strict();

export type UpdateCourseBodySchema = z.output<typeof UpdateCourseBodySchema>;
