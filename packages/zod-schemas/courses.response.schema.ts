import z from "zod";
import { courseSchema, courseInfoSchema } from "./courses.schema";
import { Section } from "./carts.response.schema";

export const CourseNoResponseSchema = courseSchema.extend({
  courseInfo: courseInfoSchema,
  sections: z.array(Section),
});

export type CourseNoResponse = z.infer<typeof CourseNoResponseSchema>;
