import z from "zod";
import { semester, studyProgram, visible } from "./constants.js";
import {
  mapSemester,
  mapStudyProgram,
  mapVisible,
} from "../utils/enumMapper.js";

export const ListCartsQuerySchema = z
  .object({
    academicYear: z.coerce.number().int().optional(),
    semester: z
      .enum(semester)
      .optional()
      .transform((v) => (v ? mapSemester(v) : undefined)),
    studyProgram: z
      .enum(studyProgram)
      .optional()
      .transform((v) => (v ? mapStudyProgram(v) : undefined)),
  })
  .strict();

export type ListCartsQuerySchema = z.output<typeof ListCartsQuerySchema>;

export const CreateCartBodySchema = z
  .object({
    academicYear: z.number().int().min(2564),
    semester: z.enum(semester).transform((v) => mapSemester(v)),
    studyProgram: z.enum(studyProgram).transform((v) => mapStudyProgram(v)),
    name: z.string().nonempty(),
    isDefault: z.boolean(),
  })
  .strict();

export type CreateCartBodySchema = z.output<typeof CreateCartBodySchema>;

export const UpdateCartBodySchema = z
  .object({
    name: z.string().nonempty().optional(),
    visible: z
      .enum(visible)
      .optional()
      .transform((v) => (v ? mapVisible(v) : undefined)),
    isDefault: z.boolean().optional(),
    cartOrder: z.number().min(0).optional(),
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
    cartOrder: z.number().int().optional(),
  })
  .strict();

export type UpdateCourseBodySchema = z.output<typeof UpdateCourseBodySchema>;
