import { OpenAPIHono } from "@hono/zod-openapi";

import { middlewareAuth } from "./auth.js";

import type { Variables } from "../lib/auth.js";
import {
  getPublicCartDetailRoute,
  importPublicCartRoute,
} from "../routes_define/publicCarts.routes.js";
import { publicCartsService } from "../services/publicCartsService.js";

const publicCarts = new OpenAPIHono<{ Variables: Variables }>();
publicCarts.use("/:cartId/import", middlewareAuth);

publicCarts
  // 4.1. Public view of timetable (from share with link)
  .openapi(getPublicCartDetailRoute, async (c) => {
    try {
      const cartId = c.req.param("cartId");
      const result = await publicCartsService.getPublicCartDetail(cartId);
      return c.json({ data: result }, 200);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "PUBLIC_CART_NOT_FOUND_OR_PRIVATE"
      ) {
        return c.json({ error: "PUBLIC_CART_NOT_FOUND_OR_PRIVATE" }, 404);
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.2. Import timetable from public link
  .openapi(importPublicCartRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const cartId = c.req.param("cartId");

      let name: string | undefined;
      try {
        const body = await c.req.json();
        name = body?.name;
      } catch {}

      const newCart = await publicCartsService.importPublicCart(
        userId,
        cartId,
        name,
      );
      return c.json({ data: { cart: newCart } }, 201);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "PUBLIC_CART_NOT_FOUND_OR_PRIVATE"
      ) {
        return c.json({ error: "PUBLIC_CART_NOT_FOUND_OR_PRIVATE" }, 404);
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default publicCarts;
