import { OpenAPIHono } from "@hono/zod-openapi";
import { Effect } from "effect";

import { middlewareAuth } from "./auth.js";

import { PrismaLive } from "../db/clients.js";
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
  // Similar to 3.5
  .openapi(getPublicCartDetailRoute, async (c) => {
    const cartId = c.req.param("cartId");

    const program = publicCartsService.getPublicCartDetail(cartId);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: (result) => {
            return c.json({ data: result }, 200);
          },
          onFailure: (err) => {
            if (err.message === "PUBLIC_CART_NOT_FOUND_OR_PRIVATE") {
              return c.json({ error: "PUBLIC_CART_NOT_FOUND_OR_PRIVATE" }, 404);
            }
            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        }),
      ),
    );
  })

  // 4.2. Import timetable from public link
  .openapi(importPublicCartRoute, async (c) => {
    const userId = c.get("user").id;
    const cartId = c.req.param("cartId");
    const body = c.req.json();

    const program = publicCartsService.importPublicCart(userId, cartId, body);

    return await Effect.runPromise(
      program.pipe(
        Effect.provide(PrismaLive),
        Effect.match({
          onSuccess: (newCart) => {
            return c.json({ data: { cart: newCart } }, 201);
          },
          onFailure: (err) => {
            if (err.message === "PUBLIC_CART_NOT_FOUND_OR_PRIVATE") {
              return c.json({ error: "PUBLIC_CART_NOT_FOUND_OR_PRIVATE" }, 404);
            }

            return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
          },
        }),
      ),
    );
  });

export default publicCarts;
