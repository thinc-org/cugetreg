import { z } from "zod";

export const AnnouncementIdParamSchema = z.object({
  announcementId: z.string(),
});

export type AnnouncementIdParamSchema = z.infer<
  typeof AnnouncementIdParamSchema
>;

export const CreateAnnouncementBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export type CreateAnnouncementBodySchema = z.infer<
  typeof CreateAnnouncementBodySchema
>;
