import { OpenAPIHono } from "@hono/zod-openapi";

const user = new OpenAPIHono();

user.get("/", async (c) => {
  return c.json({ message: "5.1. Get User Information" });
});

user.get("/reviews", async (c) => {
  return c.json({ message: "5.2. Get User Review" });
});

user.patch("/", async (c) => {
  return c.json({ message: "5.3. Update User Information" });
});

export default user;
