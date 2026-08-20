import { prisma } from "@/db/clients.js";
import { VoteType } from "@/generated/prisma/enums.js";
import {
  mapFacultyCode,
  mapReviewStatus,
  unmapFacultyCode,
} from "@/utils/enumMapper.js";

import type {
  GetUserReviewsQuery,
  UpdateUserInfoBody,
} from "@cugetreg/zod-schemas/user";

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
      faculty: unmapFacultyCode(user!.faculty),
      department: user!.department,
      createdAt: user!.createdAt,
      updatedAt: user!.updatedAt,
    };
  },
  getUserReviews: async (userId: string, query: GetUserReviewsQuery) => {
    const { page, limit, status, includeVote } = query;
    const offset = (page - 1) * limit;
    const where = {
      userId,
      status: status ? mapReviewStatus(status) : undefined,
    };

    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        omit: {
          userId: true,
          updatedAt: true,
        },
        include: {
          courseInfo: {
            select: {
              abbrName: true,
              courses: {
                select: {
                  genEdType: true,
                },
                take: 1,
              },
            },
          },
        },
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.review.count({ where }),
    ]);

    const reviewIds = reviews.map((review) => review.id);
    const [voteCounts, myVotes] = await Promise.all([
      (reviewIds.length === 0 || !includeVote)
        ? []
        : prisma.reviewVote.groupBy({
            by: ["reviewId", "voteType"],
            where: { reviewId: { in: reviewIds } },
            _count: { _all: true },
          }),
      (reviewIds.length === 0 || !includeVote)
        ? []
        : prisma.reviewVote.findMany({
            where: { userId, reviewId: { in: reviewIds } },
            select: { reviewId: true, voteType: true },
          }),
    ]);

    const reactions = new Map(
      myVotes.map((vote) => [vote.reviewId, vote.voteType]),
    );

    const resultReviews = reviews.map((review) => {
      const {
        courseInfo: {
          abbrName,
          courses: [{ genEdType }],
        },
        ...r
      } = review;

      const reviewVotes = voteCounts.filter((v) => v.reviewId === review.id);
      const likeCount =
        reviewVotes.find((v) => v.voteType === VoteType.L)?._count._all ?? 0;
      const dislikeCount =
        reviewVotes.find((v) => v.voteType === VoteType.D)?._count._all ?? 0;
      const reaction = reactions.get(review.id);

      return {
        ...r,
        courseAbbrName: abbrName,
        genEdType,
        ...(includeVote && {
          stats: { likeCount, dislikeCount },
          ...(reaction && { reaction }),
        })
      };
    });

    return { reviews: resultReviews, totalReviews };
  },
  updateUserInfo: async (userId: string, body: UpdateUserInfoBody) => {
    const { name, faculty, department } = body;
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        faculty: faculty ? mapFacultyCode(faculty) : null,
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
      faculty: unmapFacultyCode(updatedUser.faculty),
    };
  },
};
