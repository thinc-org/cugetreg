import type { Variables } from "@/lib/auth.js";
import {
  createActivityRoute,
  deleteActivityRoute,
  updateActivityRoute,
} from "@/routes_define/activity.routes.js";
import { activityService } from "@/services/activityService.js";

import { OpenAPIHono } from "@hono/zod-openapi";

const activity = new OpenAPIHono<{ Variables: Variables }>()

  .openapi(createActivityRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const validatedData = c.req.valid("json");
      const newActivity = await activityService.createActivity(
        userId,
        validatedData,
      );
      return c.json({ data: newActivity }, 201);
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

  .openapi(updateActivityRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const activityId = c.req.param("activityId");
      const updatedData = c.req.valid("json");
      const updatedActivity = await activityService.updateActivity(
        userId,
        activityId,
        updatedData,
      );
      return c.json({ data: updatedActivity }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "ACTIVITY_NOT_FOUND") {
          return c.json({ error: "ACTIVITY_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_CART_OWNER") {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  .openapi(deleteActivityRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const activityId = c.req.param("activityId");
      await activityService.deleteActivity(userId, activityId);
      return c.body(null, 204);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "ACTIVITY_NOT_FOUND") {
          return c.json({ error: "ACTIVITY_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_CART_OWNER") {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default activity;
