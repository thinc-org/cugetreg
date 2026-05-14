import z from "zod";

import { Section } from "./carts.response.schema";
import { courseInfoSchema, courseSchema } from "./courses.schema";

export const CourseNoResponseSchema = courseSchema.extend({
  courseInfo: courseInfoSchema,
  sections: z.array(Section),
});

export type CourseNoResponse = z.infer<typeof CourseNoResponseSchema>;
