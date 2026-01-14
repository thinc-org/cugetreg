import { z } from "zod";
import {
  assessment,
  days,
  genEdType,
  sortBy,
  sortOrder,
  studyProgram,
  TIME_REGEX,
} from "./constants.js";


//1.1 get courses
export const getCourseQuerySchema = z.object({
  studyProgram: z.enum(studyProgram),
  academicYear: z.number().int().min(2564),
  semester: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  // Optional Query
  q: z.string().optional(),
  genEdType: z.enum(genEdType).optional(),
  faculty: z.string().optional(),
  day: z.enum(days).optional(),
  timeStart: z.string().regex(TIME_REGEX).optional(),
  timeEnd: z.string().regex(TIME_REGEX).optional(),
  noPrereq: z.boolean().optional(),
  fitCardId: z.string().optional(),
  assessment: z.enum(assessment).optional(),
  sortBy: z.enum(sortBy).optional(),
  sortOrder: z.enum(sortOrder).optional(),
  limit: z.number().int().optional(),
});
// 1. Sub-schema for the 'course' object
const courseSchema = z.object({
  id: z.string(),
  studyProgram: z.string(),
  academicYear: z.number().int(),
  semester: z.string(),
  courseNo: z.string(),
  genEdType: z.string(),
  midtermStart: z.string().datetime().nullable(),
  midtermEnd: z.string().datetime().nullable(),
  finalStart: z.string().datetime().nullable(),
  finalEnd: z.string().datetime().nullable(),
});

// 2. Sub-schema for the 'courseInfo' object
const courseInfoSchema = z.object({
  courseNo: z.string(),
  abbrName: z.string(),
  courseNameEn: z.string(),
  courseNameTh: z.string(),
  courseDescEn: z.string().nullable(), // Nullable since your data shows null
  courseDescTh: z.string().nullable(),
  faculty: z.string(),
  department: z.string(),
  credit: z.string(), // "3.0" is a string in your JSON
  creditHours: z.string(),
});

// 3. Sub-schema for the 'stats' object
const statsSchema = z.object({
  sectionsCount: z.number().int(),
  capacitySum: z.number().int(),
  remainingSum: z.number().int(),
  hasSeats: z.boolean(),
  isClosedAll: z.boolean(),
});

// 4. The Main Schema combining everything
export const courseDetailsSchema = z.object({
  course: courseSchema,
  courseInfo: courseInfoSchema,
  stats: statsSchema,
  fitMySchedule: z.boolean(),
});
//1.2 get course detail by id
// In your schema file
export const courseNoParamSchema = z.object({
  courseNo: z.string().describe("The registration number of the course"),
});



/*
  Default return HTTP Status 400 Bad Request
  {
  "success": false,
  "error": {
    "name": "ZodError",
    "issues": [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "undefined",
        "path": ["studyProgram"],
        "message": "Required"
      },
      {
        "code": "invalid_type",
        "expected": "number",
        "received": "undefined",
        "path": ["academicYear"],
        "message": "Required"
      },
      {
        "code": "invalid_type",
        "expected": "1 | 2 | 3",
        "received": "undefined",
        "path": ["semester"],
        "message": "Required"
      }
    ]
  }
*/
