import z from "zod";
import { semester, studyProgram, visible } from "./constants.js";
import {
  mapSemester,
  mapStudyProgram,
  mapVisible,
} from "../utils/enumMapper.js";

export const listCartsQuerySchema = z
  .object({
    academicYear: z.number().int().min(2564).optional(),
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

export const createCartBodySchema = z
  .object({
    academicYear: z.number().int().min(2564),
    semester: z.enum(semester).transform((v) => mapSemester(v)),
    studyProgram: z.enum(studyProgram).transform((v) => mapStudyProgram(v)),
    name: z.string().nonempty(),
    isDefault: z.boolean(),
  })
  .strict();

export const updateCartBodySchema = z
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

export const addCourseBodySchema = z
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

export const updateCourseBodySchema = z
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
