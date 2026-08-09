import { createRoute } from "@hono/zod-openapi";

import {
  ActivityIdParamSchema,
  CreateActivityBodySchema,
  UpdateActivityBodySchema,
} from "@cugetreg/zod-schemas/activity";
import { SingleActivityResponseSchema } from "@cugetreg/zod-schemas/activity-response";

import { errorRes, InternalError } from "./errorRes.js";

export const createActivityRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Create activity",
  request: {
    body: {
      content: { "application/json": { schema: CreateActivityBodySchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: SingleActivityResponseSchema } },
      description: "Created",
    },
    403: errorRes("NOT_CART_OWNER"),
    404: errorRes("CART_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

export const updateActivityRoute = createRoute({
  method: "patch",
  path: "/{activityId}",
  summary: "Update activity",
  request: {
    params: ActivityIdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateActivityBodySchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: SingleActivityResponseSchema } },
      description: "Updated",
    },
    403: errorRes("NOT_CART_OWNER"),
    404: errorRes("ACTIVITY_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

export const deleteActivityRoute = createRoute({
  method: "delete",
  path: "/{activityId}",
  summary: "Delete activity",
  request: { params: ActivityIdParamSchema },
  responses: {
    204: { description: "Deleted" },
    403: errorRes("NOT_CART_OWNER"),
    404: errorRes("ACTIVITY_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
