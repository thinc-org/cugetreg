import { createRoute } from "@hono/zod-openapi";

import { AnnouncementIdParamSchema } from "@cugetreg/zod-schemas/announcement";
import {
  AnnouncementDetailResponseSchema,
  ListAnnouncementsResponseSchema,
} from "@cugetreg/zod-schemas/announcement-response";

import { errorRes, InternalError } from "./errorRes.js";

export const listAnnouncementsRoute = createRoute({
  method: "get",
  path: "/",
  summary: "List announcements",
  responses: {
    200: {
      content: {
        "application/json": { schema: ListAnnouncementsResponseSchema },
      },
      description: "OK",
    },
    500: InternalError,
  },
});

export const getAnnouncementByIdRoute = createRoute({
  method: "get",
  path: "/{announcementId}",
  summary: "Get announcement detail",
  request: { params: AnnouncementIdParamSchema },
  responses: {
    200: {
      content: {
        "application/json": { schema: AnnouncementDetailResponseSchema },
      },
      description: "OK",
    },
    404: errorRes("ANNOUNCEMENT_NOT_FOUND"),
    500: InternalError,
  },
});
