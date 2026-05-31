import { z } from "@hono/zod-openapi";

export const errorRes = (message: string) => ({
  content: {
    "application/json": {
      schema: z.object({
        error: z.string().openapi({ example: message }),
      }),
    },
  },
  description: message,
});

export const InternalError = errorRes("INTERNAL_SERVER_ERROR");

export const BadRequestError = errorRes("Bad Request / Validation Failed");
