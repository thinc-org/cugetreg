import { z } from "zod";

export const AnnouncementIdParamSchema = z.object({
  announcementId: z.string(),
});

export type AnnouncementIdParamSchema = z.infer<
  typeof AnnouncementIdParamSchema
>;
