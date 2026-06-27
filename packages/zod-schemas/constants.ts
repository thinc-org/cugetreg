import z from "zod";

export const TIME_REGEX = /^(IA|AR)|([01]\d|2[0-3]):([0-5]\d)$/;

export const days = z.enum([
  "MO",
  "TU",
  "WE",
  "TH",
  "FR",
  "SA",
  "SU",
  "AR",
  "IA",
  "IR",
]);
export const studyProgram = z.enum(["T", "I", "S"]);
export const genEdType = z.enum(["NO", "SC", "SO", "HU", "IN"]);
export const assessment = z.enum(["LETTER", "SU"]);
export const sortBy = z.enum([
  "NAME",
  "CAPACITY_SUM",
  "REMAINING_SUM",
  "COURSE_NO",
]);
export const sortOrder = z.enum(["asc", "desc"]);
export const semester = z.enum(["FIRST", "SECOND", "SUMMER"]);
export const visible = z.enum(["PUB", "PVT"]);
export const reviewStatus = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export const vote = z.enum(["L", "D"]);

export type Days = z.infer<typeof days>;
export type StudyProgram = z.infer<typeof studyProgram>;
export type GenEdType = z.infer<typeof genEdType>;
export type Assessment = z.infer<typeof assessment>;
export type SortBy = z.infer<typeof sortBy>;
export type SortOrder = z.infer<typeof sortOrder>;
export type Semester = z.infer<typeof semester>;
export type Visible = z.infer<typeof visible>;
export type ReviewStatus = z.infer<typeof reviewStatus>;
export type Vote = z.infer<typeof vote>;
