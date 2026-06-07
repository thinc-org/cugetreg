import { createRoute } from "@hono/zod-openapi";

import { InternalError } from "./errorRes.js";

import {
  UpdateUserInfoResponseSchema,
  UserResponseSchema,
  UserReviewResponseSchema,
} from "@cugetreg/zod-schemas/user-response";
import {
  GetUserReviewsQuerySchema,
  UpdateUserInfoBodySchema,
} from "@cugetreg/zod-schemas/user";

export const getUserRoute = createRoute({
  method: "get",
  path: "/",
  summary: "5.1 Get User Info",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
      description: "Get user info successfully",
    },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

export const getUserReviewsRoute = createRoute({
  method: "get",
  path: "/reviews",
  summary: "5.2 Get User's Reviews",
  request: {
    query: GetUserReviewsQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserReviewResponseSchema,
        },
      },
      description: "Get user's reviews successfully",
    },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

export const updateUserInfoRoute = createRoute({
  method: "patch",
  path: "/",
  summary: "5.3 Update User Info",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateUserInfoBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UpdateUserInfoResponseSchema,
        },
      },
      description: "Update user info successfully",
    },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
