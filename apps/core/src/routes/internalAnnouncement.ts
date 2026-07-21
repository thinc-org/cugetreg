import { createAnnouncementRoute } from "@/routes_define/announcement.routes.js";
import { announcementService } from "@/services/announcementService.js";

import { OpenAPIHono } from "@hono/zod-openapi";

const internalAnnouncement = new OpenAPIHono();

internalAnnouncement.openapi(createAnnouncementRoute, async (c) => {
  try {
    const { title, content } = c.req.valid("json");
    const created = await announcementService.createAnnouncement({
      title,
      content,
    });
    return c.json({ data: created }, 201);
  } catch {
    return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
  }
});

export default internalAnnouncement;
