import { Hono } from "hono";
import { prisma } from "../db/clients.js";
import { zValidator } from "@hono/zod-validator";
import {
  createCartBodySchema,
  listCartsQuerySchema,
  updateCartBodySchema,
} from "../zod_schemas/carts.schema.js";

const carts = new Hono();

// Manage Timetable

// 3.1. List timetables for current user
carts.get("/", zValidator("query", listCartsQuerySchema), async (c) => {
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

// 3.2. Create new timetable (cart)
carts.post("/", zValidator("json", createCartBodySchema), async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  const validatedData = c.req.valid("json");
  c.req.valid("json");
  try {
    // Sequence of dependent operation
    const newCart = await prisma.$transaction(async (tx) => {
      // Set other isDefault
      if (validatedData.isDefault) {
        await tx.cart.updateMany({
          where: {
            userId: userId,
            academicYear: validatedData.academicYear,
            semester: validatedData.semester,
            studyProgram: validatedData.studyProgram,
            isDefault: true,
          },
          data: { isDefault: false },
        });
      }
      // Find max of cart_order
      const aggregate = await tx.cart.aggregate({
        where: {
          userId,
          academicYear: validatedData.academicYear,
          semester: validatedData.semester,
          studyProgram: validatedData.studyProgram,
        },
        _max: { cartOrder: true },
      });
      // When aggregate._max.cartOrder === null , nextCartOrder = 0
      const nextCartOrder = (aggregate._max.cartOrder ?? -1) + 1;

      return await tx.cart.create({
        data: {
          userId,
          cartOrder: nextCartOrder,
          ...validatedData,
        },
      });
    });
    return c.json({ data: newCart }, 201);
  } catch (err) {
    console.error("Fetch Carts Error:", err);
    return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
  }
});

// 3.3. Edit timetable (cart) (Rename, Set default, share/stop share, Ordering)
carts.patch("/:cartId", zValidator("json", updateCartBodySchema), async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  const cartId = c.req.param("cartId");
  const updatedData = c.req.valid("json");
  try {
    const updatedCart = await prisma.$transaction(async (tx) => {
      // Find current cart
      const targetCart = await tx.cart.findFirst({
        where: { id: cartId },
      });

      if (!targetCart) {
        throw new Error("CART_NOT_FOUND");
      }
      if (targetCart.userId !== userId) throw new Error("NOT_CART_OWNER");

      // Set other isDefault
      if (updatedData.isDefault === true) {
        await tx.cart.updateMany({
          where: {
            userId,
            academicYear: targetCart.academicYear,
            semester: targetCart.semester,
            studyProgram: targetCart.studyProgram,
            isDefault: true,
          },
          data: { isDefault: false },
        });
      }

      // Reorder other cartOrder -> Please review this code!
      const newOrder = updatedData.cartOrder;
      const oldOrder = targetCart.cartOrder;
      if (newOrder !== undefined && newOrder !== oldOrder) {
        const isMoveDown = oldOrder < newOrder;
        await tx.cart.updateMany({
          where: {
            userId,
            academicYear: targetCart.academicYear,
            semester: targetCart.semester,
            studyProgram: targetCart.studyProgram,
            cartOrder: isMoveDown
              ? { gt: oldOrder, lte: newOrder }
              : { gte: newOrder, lt: oldOrder },
          },
          data: {
            cartOrder: {
              [isMoveDown ? "decrement" : "increment"]: 1,
            },
          },
        });
      }

      return await tx.cart.update({
        where: { id: cartId },
        data: updatedData,
      });
    });
    return c.json({ data: updatedCart }, 200);
  } catch (err: any) {
    console.error("Fetch Carts Error:", err);
    if (err.message === "CART_NOT_FOUND") {
      return c.json({ error: "CART_NOT_FOUND" }, 404);
    } else if (err.message === "NOT_CART_OWNER") {
      return c.json({ error: "NOT_CART_OWNER" }, 403);
    } else {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  }
});

// 3.4. Delete timetable (cart)
carts.delete("/:cartId", async (c) => {
  const userId = c.get("jwtPayload").id;
  const cartId = c.req.param("cartId");
  try {
    await prisma.$transaction(async (tx) => {
      const targetCart = await tx.cart.findUnique({
        where: { id: cartId },
      });
      if (!targetCart) throw new Error("CART_NOT_FOUND");
      if (targetCart.userId !== userId) throw new Error("NOT_CART_OWNER");

      await tx.cart.delete({
        where: { id: cartId },
      });
      // Reorder cartOrder -> Please review this code
      await tx.cart.updateMany({
        where: {
          userId,
          academicYear: targetCart.academicYear,
          semester: targetCart.semester,
          studyProgram: targetCart.studyProgram,
          cartOrder: { gt: targetCart.cartOrder },
        },
        data: {
          cartOrder: { decrement: 1 },
        },
      });

      // Case deletedCart is default assign least cartOrder to be next default
      if (targetCart.isDefault) {
        const nextDefaultCart = await tx.cart.findFirst({
          where: {
            userId,
            academicYear: targetCart.academicYear,
            semester: targetCart.semester,
            studyProgram: targetCart.studyProgram,
          },
          orderBy: { cartOrder: "asc" },
        });
        if (nextDefaultCart) {
          await tx.cart.update({
            where: { id: nextDefaultCart.id },
            data: { isDefault: true },
          });
        }
      }
    });
    return c.body(null, 204);
  } catch (err: any) {
    console.error("Fetch Carts Error:", err);
    if (err.message === "CART_NOT_FOUND") {
      return c.json({ error: "CART_NOT_FOUND" }, 404);
    } else if (err.message === "NOT_CART_OWNER") {
      return c.json({ error: "NOT_CART_OWNER" }, 403);
    } else {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  }
});

// 3.5. Get timetable details (courses, credits, ect.)
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
