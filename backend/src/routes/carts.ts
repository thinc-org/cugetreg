import { Hono } from "hono";
import { prisma } from "../db/clients.js";
import { zValidator } from "@hono/zod-validator";
import { listTimeTableQuerySchema } from "../zod_schemas/carts.schema.js";

const carts = new Hono();

// Manage Timetable

// 3.1. List timetables for current user
carts.get("/", zValidator("query", listTimeTableQuerySchema), async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  const { academicYear, semester, studyProgram } = c.req.valid("query");
  try {
    const userCarts = await prisma.cart.findMany({
      where: {
        userId: userId,
        academicYear: academicYear,
        semester: semester,
        studyProgram: studyProgram,
      },
    });
    return c.json({ data: userCarts });
  } catch (err) {
    console.error("Fetch Carts Error:", err);
    return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
  }
});

carts.post("/", async (c) => {
  return c.json({ message: "3.2. Create new timetable (cart)" });
});

carts.patch("/:cartId", async (c) => {
  return c.json({
    message:
      "3.3. Edit timetable (cart) (Rename, Set default, share/stop share, Ordering)",
  });
});

carts.delete("/:cartId", async (c) => {
  return c.json({ message: "3.4. Delete timetable (cart)" });
});

carts.get("/:cartId", async (c) => {
  return c.json({
    message: "3.5. Get timetable details (courses, credits, ect.)",
  });
});

// Manange Course in Timetable

carts.post("/:cartId/items", async (c) => {
  return c.json({ message: "3.6. Add course to timetable" });
});

carts.patch("/:itemId", async (c) => {
  return c.json({ message: "3.7. Update/edit course in timetable" });
});

carts.delete("/:itemId", async (c) => {
  return c.json({ message: "3.8. Remove course from timetable" });
});

export default carts;
