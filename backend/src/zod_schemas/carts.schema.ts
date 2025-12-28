import z from "zod";
import { semester, studyProgram, visible } from "./constants.js";
import {
  mapSemester,
  mapStudyProgram,
  mapVisible,
} from "../utils/enumMapper.js";

export const listCartsQuerySchema = z.object({
  academicYear: z.number().int().min(2564).optional(),
  semester: z
    .enum(semester)
    .optional()
    .transform((v) => (v ? mapSemester(v) : undefined)),
  studyProgram: z
    .enum(studyProgram)
    .optional()
    .transform((v) => (v ? mapStudyProgram(v) : undefined)),
});

export const createCartBodySchema = z.object({
  academicYear: z.number().int().min(2564),
  semester: z.enum(semester).transform((v) => mapSemester(v)),
  studyProgram: z.enum(studyProgram).transform((v) => mapStudyProgram(v)),
  name: z.string().nonempty(),
  isDefault: z.boolean(),
});

export const updateCartBodySchema = z.object({
  name: z.string().nonempty().optional(),
  visible: z
    .enum(visible)
    .optional()
    .transform((v) => (v ? mapVisible(v) : undefined)),
  isDefault: z.boolean().optional(),
  cartOrder: z.number().min(0).optional(),
});
