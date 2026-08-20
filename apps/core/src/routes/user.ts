import type { Variables } from "@/lib/auth.js";
import {
  getUserReviewsRoute,
  getUserRoute,
  updateUserInfoRoute,
} from "@/routes_define/users.routes.js";
import { usersService } from "@/services/usersService.js";

import { OpenAPIHono } from "@hono/zod-openapi";

const user = new OpenAPIHono<{ Variables: Variables }>();

user
  // 5.1. Get user information
  .openapi(getUserRoute, async (c) => {
    try {
      const { id: userId } = c.get("user");
      const data = await usersService.getUserInfo(userId);
      return c.json(data, 200);
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  // 5.2. Get user reviews
  .openapi(getUserReviewsRoute, async (c) => {
    try {
      const { id: userId } = c.get("user");
      const query = c.req.valid("query");
      const { reviews, totalReviews } = await usersService.getUserReviews(
        userId,
        query,
      );
      return c.json(
        {
          totalReviews,
          page: query.page,
          limit: query.limit,
          reviews,
        },
        200,
      );
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  // 5.3. Update user information
  .openapi(updateUserInfoRoute, async (c) => {
    try {
      const { id: userId } = c.get("user");
      const body = c.req.valid("json");
      const updatedUser = await usersService.updateUserInfo(userId, body);
      return c.json(
        {
          message: "User profile updated successfully",
          user: updatedUser,
        },
        200,
      );
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default user;
