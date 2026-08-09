import {
  getAnnouncementByIdRoute,
  listAnnouncementsRoute,
} from "@/routes_define/announcement.routes.js";
import { announcementService } from "@/services/announcementService.js";

import { OpenAPIHono } from "@hono/zod-openapi";

const announcement = new OpenAPIHono();

announcement
  .openapi(listAnnouncementsRoute, async (c) => {
    try {
      const announcements = await announcementService.listAnnouncements();
      return c.json({ data: announcements }, 200);
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  .openapi(getAnnouncementByIdRoute, async (c) => {
    try {
      const { announcementId } = c.req.valid("param");
      const found =
        await announcementService.getAnnouncementById(announcementId);
      return c.json({ data: found }, 200);
    } catch (err) {
      if (err instanceof Error && err.message === "ANNOUNCEMENT_NOT_FOUND") {
        return c.json({ error: "ANNOUNCEMENT_NOT_FOUND" }, 404);
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default announcement;
