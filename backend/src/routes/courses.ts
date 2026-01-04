import { zValidator } from "@hono/zod-validator";
import { prisma } from "../db/clients.js";
import { getCourseQuerySchema } from "../zod_schemas/courses.schema.js";
import { OpenAPIHono } from "@hono/zod-openapi";

const courses = new OpenAPIHono();

courses.get("/", zValidator("param", getCourseQuerySchema), async (c) => {
  const courses = await prisma.user.findMany();
  return c.json({ message: "1.1 Get Courses" });
});

courses.get("/:courseNo", async (c) => {
  return c.json({ message: "1.2 Get Course Detail" });
});

export default courses;
