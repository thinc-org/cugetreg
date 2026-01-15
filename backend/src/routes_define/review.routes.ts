import { createRoute } from "@hono/zod-openapi";
import {z} from "zod";
import * as ReviewSchema from "../zod_schemas/reviews.schema.js"; // Adjust path
//2.1
export const submitReviewRoute = createRoute({
  method: "post",
  path: "/reviews", // OR "/courses/reviews" depending on your API design
  summary: "2.1 Submit a new review",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ReviewSchema.createReviewRequestSchema,
        },
      },
      description: "Review details",
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: ReviewSchema.createReviewResponseSchema,
        },
      },
      description: "Review submitted successfully",
    },
    400: { description: "Invalid input" },
    401: { description: "Unauthorized" },
    500: { description: "Internal Server Error" },
  },
  security: [{ Bearer: [] }],
});
//2.2
export const reactReviewRoute = createRoute({
  method: "patch",
  path: "/react/{id}",
  summary: "2.2 Like or Dislike a review",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { "application/json": { schema: ReviewSchema.reactReviewRequestSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: ReviewSchema.reactReviewResponseSchema } },
      description: "Interaction updated successfully",
    },
    401: { description: "Unauthorized" },
    404: { description: "Review not found" },
    500: { description: "Internal Server Error" },
  },
  security: [{ Bearer: [] }],
});


export const editReviewRoute = createRoute({
  method: "patch",
  path: "/reviews/{id}",
  summary: "2.3 Edit Review",
  description: "แก้ไขเนื้อหาของรีวิว (เฉพาะเจ้าของรีวิวเท่านั้น)",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: ReviewSchema.editReviewRequestSchema,
        },
      },
      description: "Updated review content",
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ReviewSchema.editReviewResponseSchema,
        },
      },
      description: "Review updated successfully",
    },
    401: { description: "Unauthorized" },
    403: { description: "Forbidden (Not review owner)" },
    404: { description: "Review not found" },
    500: { description: "Internal Server Error" },
  },
  security: [{ Bearer: [] }],
});
//2.4
export const deleteReviewRoute = createRoute({
  method: "delete",
  path: "/reviews/{id}",
  summary: "2.4 Delete Review",
  description: "ลบรีวิวออกจากระบบถาวร (เฉพาะเจ้าของรีวิวเท่านั้น)",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ReviewSchema.deleteReviewResponseSchema,
        },
      },
      description: "Review deleted successfully",
    },
    401: { description: "Unauthorized" },
    403: { description: "Forbidden (Not review owner)" },
    404: { description: "Review not found" },
    500: { description: "Internal Server Error" },
  },
  security: [{ Bearer: [] }],
});
