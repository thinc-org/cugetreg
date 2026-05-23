import { OpenAPIHono } from "@hono/zod-openapi";

import type { Variables } from "../lib/auth.js";
import {
  addCourseRoute,
  createCartRoute,
  deleteCartRoute,
  deleteCourseRoute,
  getCartDetailRoute,
  listCartsRoute,
  updateCartRoute,
  updateCourseRoute,
} from "../routes_define/carts.routes.js";
import { cartService } from "../services/cartsService.js";

const carts = new OpenAPIHono<{ Variables: Variables }>()

  // 3.1. List timetables for current user
  .openapi(listCartsRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const query = c.req.valid("query");
      const data = await cartService.getAllCartItems(userId, query);
      return c.json({ data }, 200);
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 3.2. Create new timetable (cart)
  .openapi(createCartRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const validatedData = c.req.valid("json");
      const newCart = await cartService.createCart(userId, validatedData);
      return c.json({ data: newCart }, 201);
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 3.3. Edit timetable (cart) (Rename, Set default, share/stop share, Ordering)
  .openapi(updateCartRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const cartId = c.req.param("cartId");
      const updatedData = c.req.valid("json");
      const updatedCart = await cartService.updateCart(
        userId,
        cartId,
        updatedData,
      );
      return c.json({ data: updatedCart }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "CART_NOT_FOUND") {
          return c.json({ error: "CART_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_CART_OWNER") {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 3.4. Delete timetable (cart)
  .openapi(deleteCartRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const cartId = c.req.param("cartId");
      await cartService.deleteCart(userId, cartId);
      return c.body(null, 204);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "CART_NOT_FOUND") {
          return c.json({ error: "CART_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_CART_OWNER") {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 3.5. Get timetable details (courses, credits, ect.)
  .openapi(getCartDetailRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const cartId = c.req.param("cartId");
      const result = await cartService.getCartDetail(userId, cartId);
      return c.json({ data: result }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "CART_NOT_FOUND") {
          return c.json({ error: "CART_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_CART_OWNER") {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 3.6. Add course to timetable
  .openapi(addCourseRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const cartId = c.req.param("cartId");
      const validatedData = c.req.valid("json");
      const newItem = await cartService.addCourseToCart(
        userId,
        cartId,
        validatedData,
      );
      return c.json({ data: newItem }, 201);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "CART_NOT_FOUND") {
          return c.json({ error: "CART_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_CART_OWNER") {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
        if (err.message === "COURSE_NOT_FOUND") {
          return c.json({ error: "COURSE_NOT_FOUND" }, 404);
        }
        if (err.message === "SECTION_NOT_FOUND") {
          return c.json({ error: "SECTION_NOT_FOUND_FOR_SEMESTER" }, 400);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 3.7. Update/edit course in timetable
  .openapi(updateCourseRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const itemId = c.req.param("itemId");
      const updatedData = c.req.valid("json");
      const updatedItem = await cartService.updateCourseInCart(
        userId,
        itemId,
        updatedData,
      );
      return c.json({ data: updatedItem }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "ITEM_NOT_FOUND") {
          return c.json({ error: "ITEM_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_CART_OWNER") {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
        if (err.message === "SECTION_NOT_FOUND") {
          return c.json({ error: "SECTION_NOT_FOUND_FOR_SEMESTER" }, 400);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 3.8. Remove course from timetable
  .openapi(deleteCourseRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const itemId = c.req.param("itemId");
      await cartService.removeCourseFromCart(userId, itemId);
      return c.body(null, 204);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "ITEM_NOT_FOUND") {
          return c.json({ error: "ITEM_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_CART_OWNER") {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default carts;
