import { PrismaLive } from "../db/clients.js";
import { Effect } from "effect";
import { OpenAPIHono } from "@hono/zod-openapi";
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
import type { Variables } from "../lib/auth.js";
import { cartService } from "../services/cartsService.js";

const carts = new OpenAPIHono<{ Variables: Variables }>()

  // Manage Timetable

  // 3.1. List timetables for current user
  .openapi(listCartsRoute, async (c) => {
    const userId = c.get("user").id;
    const query = c.req.valid("query");

    const program = cartService.getAllCartItems(userId, query);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: (data) => c.json({ data: data }, 200),
          onFailure: (err) => c.json({ error: "INTERNAL_SERVER_ERROR" }, 500),
        })
      )
    );
  })

  // 3.2. Create new timetable (cart)
  .openapi(createCartRoute, async (c) => {
    const userId = c.get("user").id;
    const validatedData = c.req.valid("json");

    const program = cartService.createCart(userId, validatedData);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: (newCart) => {
            return c.json({ data: newCart }, 201);
          },
          onFailure: (err) => {
            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        })
      )
    );
  })

  // 3.3. Edit timetable (cart) (Rename, Set default, share/stop share, Ordering)
  .openapi(updateCartRoute, async (c) => {
    const userId = c.get("user").id;
    const cartId = c.req.param("cartId");
    const updatedData = c.req.valid("json");

    const program = cartService.updateCart(userId, cartId, updatedData);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: (updatedCart) => {
            return c.json({ data: updatedCart }, 200);
          },
          onFailure: (err) => {
            if (err.message === "CART_NOT_FOUND") {
              return c.json({ error: "CART_NOT_FOUND" }, 404);
            }
            if (err.message === "NOT_CART_OWNER") {
              return c.json({ error: "NOT_CART_OWNER" }, 403);
            }

            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        })
      )
    );
  })

  // 3.4. Delete timetable (cart)
  .openapi(deleteCartRoute, async (c) => {
    const userId = c.get("user").id;
    const cartId = c.req.param("cartId");

    const program = cartService.deleteCart(userId, cartId);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: () => {
            return c.body(null, 204);
          },
          onFailure: (err) => {
            if (err.message === "CART_NOT_FOUND") {
              return c.json({ error: "CART_NOT_FOUND" }, 404);
            }
            if (err.message === "NOT_CART_OWNER") {
              return c.json({ error: "NOT_CART_OWNER" }, 403);
            }
            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        })
      )
    );
  })

  // 3.5. Get timetable details (courses, credits, ect.)
  .openapi(getCartDetailRoute, async (c) => {
    const userId = c.get("user").id;
    const cartId = c.req.param("cartId");

    const program = cartService.getCartDetail(userId, cartId);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: (result) => {
            return c.json({ data: result }, 200);
          },
          onFailure: (err: any) => {
            if (err.message === "CART_NOT_FOUND") {
              return c.json({ error: "CART_NOT_FOUND" }, 404);
            }
            if (err.message === "NOT_CART_OWNER") {
              return c.json({ error: "NOT_CART_OWNER" }, 403);
            }
            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        })
      )
    );
  })

  // Manange Course in Timetable

  // 3.6. Add course to timetable
  .openapi(addCourseRoute, async (c) => {
    const userId = c.get("user").id;
    const validatedData = c.req.valid("json");
    const cartId = c.req.param("cartId");

    const program = cartService.addCourseToCart(userId, cartId, validatedData);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: (newItem) => {
            return c.json({ data: newItem }, 201);
          },
          onFailure: (err) => {
            if (err.message === "CART_NOT_FOUND")
              return c.json({ error: "CART_NOT_FOUND" }, 404);
            if (err.message === "NOT_CART_OWNER")
              return c.json({ error: "NOT_CART_OWNER" }, 403);
            if (err.message === "COURSE_NOT_FOUND")
              return c.json({ error: "COURSE_NOT_FOUND" }, 404);
            if (err.message === "SECTION_NOT_FOUND")
              return c.json({ error: "SECTION_NOT_FOUND_FOR_SEMESTER" }, 400);
            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        })
      )
    );
  })

  // 3.7. Update/edit course in timetable
  .openapi(updateCourseRoute, async (c) => {
    const userId = c.get("user").id;
    const itemId = c.req.param("itemId");
    const updatedData = c.req.valid("json");

    const program = cartService.updateCourseInCart(userId, itemId, updatedData);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: (updatedItem) => {
            return c.json({ data: updatedItem }, 200);
          },
          onFailure: (err) => {
            if (err.message === "ITEM_NOT_FOUND")
              return c.json({ error: "ITEM_NOT_FOUND" }, 404);
            if (err.message === "NOT_CART_OWNER")
              return c.json({ error: "NOT_CART_OWNER" }, 403);
            if (err.message === "SECTION_NOT_FOUND")
              return c.json({ error: "SECTION_NOT_FOUND_FOR_SEMESTER" }, 400);
            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        })
      )
    );
  })

  // 3.8. Remove course from timetable
  .openapi(deleteCourseRoute, async (c) => {
    const payload = c.get("user");
    const userId = payload.id;
    const itemId = c.req.param("itemId");

    const program = cartService.removeCourseFromCart(userId, itemId);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: () => {
            return c.body(null, 204);
          },
          onFailure: (err) => {
            if (err.message === "ITEM_NOT_FOUND") {
              return c.json({ error: "ITEM_NOT_FOUND" }, 404);
            }
            if (err.message === "NOT_CART_OWNER") {
              return c.json({ error: "NOT_CART_OWNER" }, 403);
            }
            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        })
      )
    );
  });

export default carts;
