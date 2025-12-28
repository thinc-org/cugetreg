import z from "zod";
import { semester, studyProgram } from "./constants.js";
import { mapSemester, mapStudyProgram } from "../utils/enumMapper.js";

export const listTimeTableQuerySchema = z.object({
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
