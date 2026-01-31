import { OpenAPIHono } from "@hono/zod-openapi";

const reviews = new OpenAPIHono();

reviews.post("/", async (c) => {
  return c.json({ message: "2.1. Submit Review" });
});

reviews.patch("/recat/:id", async (c) => {
  return c.json({ message: "2.2. Like / Dislike Review" });
});

reviews.patch("/:id", async (c) => {
  return c.json({ message: "2.3. Edit Review" });
});

reviews.delete("/:id", async (c) => {
  return c.json({ message: "2.4. Delete Review" });
});

export default reviews;
