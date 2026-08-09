import { Prisma } from "@/generated/prisma/client.js";
import type { Variables } from "@/lib/auth.js";
import {
  deleteReviewRoute,
  editReviewRoute,
  submitReviewRoute,
  voteReviewRoute,
} from "@/routes_define/review.routes.js";
import { reviewService } from "@/services/reviewService.js";

import { OpenAPIHono } from "@hono/zod-openapi";

const reviews = new OpenAPIHono<{ Variables: Variables }>();

reviews
  // 2.1. Submit a review for a course
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
      if (e instanceof Error && e.message === "SECTION_NOT_FOUND") {
        return c.json({ error: "SECTION_NOT_FOUND" }, 422);
      }
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002" //Error code for unique constraint violation (have 2 [userId, courseNo])
      ) {
        return c.json({ error: "DUPLICATE_REVIEW" }, 409);
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  // 2.2. Vote a review (upvote/downvote) and remove vote
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
  // 2.3. Edit a review
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
        if (e.message === "SECTION_NOT_FOUND") {
          return c.json({ error: "SECTION_NOT_FOUND" }, 422);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })
  // 2.4. Delete a review
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
