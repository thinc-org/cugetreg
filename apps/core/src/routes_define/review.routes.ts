import { createRoute, z } from "@hono/zod-openapi";

import { errorRes, InternalError } from "./errorRes.js";

import {
  DeleteReviewSchema,
  EditReviewResponseSchema,
  SubmitReviewResponseSchema,
  VoteReviewResponseSchema,
} from "../zod_schemas/reviews.response.schema.js";
import {
  EditReviewBodySchema,
  SubmitReviewBodySchema,
  VoteReviewBodySchema,
} from "../zod_schemas/reviews.schema.js";

export const submitReviewRoute = createRoute({
  method: "post",
  path: "/",
  summary: "2.1 Submit Review",
  request: {
    body: {
      content: { "application/json": { schema: SubmitReviewBodySchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: SubmitReviewResponseSchema } },
      description: "Created",
    },
    404: errorRes("COURSE_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

export const voteReviewRoute = createRoute({
  method: "patch",
  path: "/react/{id}",
  summary: "2.2 Like / Dislike Review",
  request: {
    params: z.object({ id: z.string().nonempty() }),
    body: {
      content: { "application/json": { schema: VoteReviewBodySchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: VoteReviewResponseSchema } },
      description: "Vote Successful",
    },
    404: errorRes("REVIEW_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

export const editReviewRoute = createRoute({
  method: "patch",
  path: "/{id}",
  summary: "2.3 Edit Review",
  request: {
    params: z.object({ id: z.string().nonempty() }),
    body: {
      content: { "application/json": { schema: EditReviewBodySchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: EditReviewResponseSchema } },
      description: "Review Edited Successfully",
    },
    403: errorRes("NOT_REVIEW_OWNER"),
    404: errorRes("REVIEW_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

export const deleteReviewRoute = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "2.4 Delete Review",
  request: {
    params: z.object({ id: z.string().nonempty() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: DeleteReviewSchema } },
      description: "Deleted",
    },
    403: errorRes("NOT_REVIEW_OWNER"),
    404: errorRes("REVIEW_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
