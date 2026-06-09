import type {
  GetUserReviewsQuery,
  UpdateUserInfoBody,
} from "@cugetreg/zod-schemas/user";

import { prisma } from "../db/clients.js";
import { mapReviewStatus } from "../utils/enumMapper.js";

export const usersService = {
  getUserInfo: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        emailVerified: true,
      },
      include: {
        accounts: {
          select: {
            accountId: true,
          },
        },
      },
    });

    const googleId = user!.accounts[0]?.accountId;
    const studentId = user!.email.split("@")[0];
    return {
      id: studentId,
      name: user!.name,
      email: user!.email,
      googleId,
      faculty: user!.faculty,
      department: user!.department,
      createdAt: user!.createdAt,
      updatedAt: user!.updatedAt,
    };
  },
  getUserReviews: async (userId: string, query: GetUserReviewsQuery) => {
    const { page, limit, status } = query;
    const offset = (page - 1) * limit;
    return prisma.review.findMany({
      omit: {
        userId: true,
        updatedAt: true,
      },
      where: {
        userId,
        status: mapReviewStatus(status),
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  updateUserInfo: async (userId: string, body: UpdateUserInfoBody) => {
    const { name, faculty, department } = body;
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        faculty: faculty || null,
        department: department || null,
      },
      omit: {
        id: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    const studentId = updatedUser.email.split("@")[0];
    return {
      ...updatedUser,
      id: studentId,
    };
  },
};
