import { OpenAPIHono } from "@hono/zod-openapi";

import type { Variables } from "../lib/auth.js";
import {
  deleteReviewRoute,
  editReviewRoute,
  submitReviewRoute,
  voteReviewRoute,
} from "../routes_define/review.routes.js";
import { reviewService } from "../services/reviewService.js";

const reviews = new OpenAPIHono<{ Variables: Variables }>();

reviews
  .openapi(submitReviewRoute, async (c) => {
    try {
      const { id: userId } = c.get("user");
      const body = c.req.valid("json");
      const data = await reviewService.submitReview(userId, body);
      return c.json({ message: "Review submitted successfully", data }, 201);
    } catch (e) {
      if (e instanceof Error && e.message === "COURSE_NOT_FOUND") {
        return c.json({ error: "COURSE_NOT_FOUND" }, 404);
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  .openapi(voteReviewRoute, async (c) => {
    try {
      const { id: userId } = c.get("user");
      const body = c.req.valid("json");
      const { id: reviewId } = c.req.valid("param");
      const data = await reviewService.voteReview(userId, reviewId, body);
      return c.json({ message: "Interaction updated successfully", data }, 200);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "REVIEW_NOT_FOUND") {
          return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  .openapi(editReviewRoute, async (c) => {
    try {
      const { id: userId } = c.get("user");
      const body = c.req.valid("json");
      const { id: reviewId } = c.req.valid("param");
      const data = await reviewService.editReview(userId, reviewId, body);
      return c.json({ message: "Review updated successfully", data }, 200);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "NOT_REVIEW_OWNER") {
          return c.json({ error: "NOT_REVIEW_OWNER" }, 403);
        }
        if (e.message === "REVIEW_NOT_FOUND") {
          return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  .openapi(deleteReviewRoute, async (c) => {
    try {
      const { id: userId } = c.get("user");
      const { id: reviewId } = c.req.valid("param");
      const data = await reviewService.deleteReview(userId, reviewId);
      return c.json({ message: "Review deleted successfully", data }, 200);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "NOT_REVIEW_OWNER") {
          return c.json({ error: "NOT_REVIEW_OWNER" }, 403);
        }
        if (e.message === "REVIEW_NOT_FOUND") {
          return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default reviews;
