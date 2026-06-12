import { createRoute, z } from "@hono/zod-openapi";

import {
  ImportPublicCartResponseSchema,
  PublicCartDetailResponseSchema,
} from "@cugetreg/zod-schemas/public-carts-response";

import { errorRes, InternalError } from "./errorRes.js";

export const getPublicCartDetailRoute = createRoute({
  method: "get",
  path: "/{cartId}",
  summary: "4.1 Public view of timetable",
  request: {
    params: z.object({ cartId: z.string() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PublicCartDetailResponseSchema,
        },
      },
      description: "OK",
    },
    404: errorRes("PUBLIC_CART_NOT_FOUND_OR_PRIVATE"),
    500: InternalError,
  },
});

export const importPublicCartRoute = createRoute({
  method: "post",
  path: "/{cartId}/import",
  summary: "4.2 Import public timetable to user's carts",
  request: {
    params: z.object({ cartId: z.string() }),
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: ImportPublicCartResponseSchema,
        },
      },
      description: "Imported successfully",
    },
    404: errorRes("PUBLIC_CART_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
