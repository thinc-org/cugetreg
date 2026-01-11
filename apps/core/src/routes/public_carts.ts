import { Hono } from "hono";
import { prisma } from "../db/clients.js";

const public_carts = new Hono();

public_carts.get("/:cartId", async (c) => {
  return c.json({
    message: "4.1. Public view of timetable (from share with link)",
  });
});

public_carts.post("/:cartId/import", async (c) => {
  return c.json({
    message: "4.2. Import timetable from public link",
  });
});

export default public_carts;
