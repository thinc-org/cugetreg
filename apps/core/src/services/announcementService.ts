import { prisma } from "@/db/clients.js";

export const announcementService = {
  listAnnouncements: async () => {
    return prisma.announcement.findMany({
      select: { id: true, title: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getAnnouncementById: async (announcementId: string) => {
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) {
      throw new Error("ANNOUNCEMENT_NOT_FOUND");
    }

    return announcement;
  },

  createAnnouncement: async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    return prisma.announcement.create({ data: { title, content } });
  },
};
