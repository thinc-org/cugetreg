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
