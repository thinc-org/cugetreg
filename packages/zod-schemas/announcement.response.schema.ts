import { z } from "zod";

export const AnnouncementListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const AnnouncementDetailSchema = AnnouncementListItemSchema.extend({
  content: z.string(),
});

export const ListAnnouncementsResponseSchema = z.object({
  data: z.array(AnnouncementListItemSchema),
});

export const AnnouncementDetailResponseSchema = z.object({
  data: AnnouncementDetailSchema,
});

export type AnnouncementListItem = z.infer<typeof AnnouncementListItemSchema>;
export type AnnouncementDetail = z.infer<typeof AnnouncementDetailSchema>;
