import { Hono } from "hono";
import { prisma } from "../db/clients.js";

const user = new Hono();

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
