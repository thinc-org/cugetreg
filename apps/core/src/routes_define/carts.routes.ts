import { createRoute, z } from "@hono/zod-openapi";

import { errorRes, InternalError } from "./errorRes.js";

import {
  CartDetailResponseSchema,
  ListCartsResponseSchema,
  SingleCartItemResponseSchema,
  SingleCartResponseSchema,
} from "../zod_schemas/carts.response.schema.js";
import {
  AddCourseBodySchema,
  CreateCartBodySchema,
  ListCartsQuerySchema,
  UpdateCartBodySchema,
  UpdateCourseBodySchema,
} from "../zod_schemas/carts.schema.js";

// 3.1 List
export const listCartsRoute = createRoute({
  method: "get",
  path: "/",
  summary: "3.1 List timetables",
  request: { query: ListCartsQuerySchema },
  responses: {
    200: {
      content: {
        "application/json": { schema: ListCartsResponseSchema },
      },
      description: "OK",
    },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 3.2 Create
export const createCartRoute = createRoute({
  method: "post",
  path: "/",
  summary: "3.2 Create new timetable",
  request: {
    body: { content: { "application/json": { schema: CreateCartBodySchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: SingleCartResponseSchema } },
      description: "Created",
    },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 3.3 Edit Cart
export const updateCartRoute = createRoute({
  method: "patch",
  path: "/{cartId}",
  summary: "3.3 Edit timetable",
  request: {
    params: z.object({ cartId: z.string() }),
    body: { content: { "application/json": { schema: UpdateCartBodySchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: SingleCartResponseSchema } },
      description: "Updated",
    },
    403: errorRes("NOT_CART_OWNER"),
    404: errorRes("CART_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 3.4 Delete Cart
export const deleteCartRoute = createRoute({
  method: "delete",
  path: "/{cartId}",
  summary: "3.4 Delete timetable",
  request: { params: z.object({ cartId: z.string() }) },
  responses: {
    204: { description: "Deleted" },
    403: errorRes("NOT_CART_OWNER"),
    404: errorRes("CART_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 3.5 Get Detail
export const getCartDetailRoute = createRoute({
  method: "get",
  path: "/{cartId}",
  summary: "3.5 Get timetable details",
  request: { params: z.object({ cartId: z.string() }) },
  responses: {
    200: {
      content: { "application/json": { schema: CartDetailResponseSchema } },
      description: "OK",
    },
    403: errorRes("NOT_CART_OWNER"),
    404: errorRes("CART_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 3.6 Add Course
export const addCourseRoute = createRoute({
  method: "post",
  path: "/{cartId}/items",
  summary: "3.6 Add course to timetable",
  request: {
    params: z.object({ cartId: z.string() }),
    body: { content: { "application/json": { schema: AddCourseBodySchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: SingleCartItemResponseSchema } },
      description: "Added",
    },
    400: {
      content: {
        "application/json": { schema: z.object({ error: z.string() }) },
      },
      description: "Bad Request",
    },
    403: {
      content: {
        "application/json": { schema: z.object({ error: z.string() }) },
      },
      description: "Forbidden",
    },
    404: {
      content: {
        "application/json": { schema: z.object({ error: z.string() }) },
      },
      description: "Not Found",
    },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 3.7 Update Course
export const updateCourseRoute = createRoute({
  method: "patch",
  path: "/items/{itemId}",
  summary: "3.7 Update course in timetable",
  request: {
    params: z.object({ itemId: z.string() }),
    body: {
      content: { "application/json": { schema: UpdateCourseBodySchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: SingleCartItemResponseSchema } },
      description: "Updated",
    },
    400: errorRes("SECTION_NOT_FOUND_FOR_SEMESTER"),
    403: errorRes("NOT_CART_OWNER"),
    404: errorRes("ITEM_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 3.8 Remove Course
export const deleteCourseRoute = createRoute({
  method: "delete",
  path: "/{cartId}/items/{itemId}",
  summary: "3.8 Remove course from timetable",
  request: {
    params: z.object({ cartId: z.string(), itemId: z.string() }),
  },
  responses: {
    204: { description: "Deleted" },
    403: errorRes("NOT_CART_OWNER"),
    404: errorRes("ITEM_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
