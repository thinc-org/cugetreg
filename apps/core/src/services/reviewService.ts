import { prisma } from "../db/clients.js";
import type { VoteType } from "../generated/prisma/enums.js";
import {
  mapReviewStatus,
  mapSemester,
  mapStudyProgram,
  mapVoteType,
} from "../utils/enumMapper.js";
import type {
  EditReviewBodySchema,
  SubmitReviewBodySchema,
  VoteReviewBodySchema,
} from "../zod_schemas/reviews.schema.js";

const semesterToNumber: Record<string, string> = {
  FIRST: "1",
  SECOND: "2",
  SUMMER: "3",
};

export const reviewService = {
  submitReview: async (userId: string, newReview: SubmitReviewBodySchema) => {
    const createdReview = await prisma.review.create({
      data: {
        ...newReview,
        userId,
        studyProgram: mapStudyProgram(newReview.studyProgram),
        semester: mapSemester(newReview.semester),
        status: mapReviewStatus("PENDING"),
      },
    });

    return {
      ...newReview,
      id: createdReview.id,
      semester: semesterToNumber[createdReview.semester],
      status: createdReview.status,
      likeCount: 0,
      dislikeCount: 0,
      isOwner: true,
      createdAt: createdReview.createdAt,
    };
  },
  voteReview: async (
    userId: string,
    reviewId: string,
    body: VoteReviewBodySchema,
  ) => {
    // Implementation for voting on a review
    const { interaction } = body;
    const [review, vote] = await Promise.all([
      prisma.review.findUnique({
        where: {
          id: reviewId,
        },
      }),
      prisma.reviewVote.findFirst({
        where: {
          userId: userId,
          reviewId: reviewId,
        },
      }),
    ]);

    if (!review) {
      throw new Error("REVIEW_NOT_FOUND");
    }

    let myInteraction: string | VoteType | null = null;

    if (!vote) {
      await prisma.reviewVote.create({
        data: {
          reviewId,
          userId,
          voteType: mapVoteType(interaction),
        },
      });
      myInteraction = mapVoteType(interaction);
    } else if (vote.voteType === mapVoteType(interaction)) {
      await prisma.reviewVote.delete({
        where: {
          id: vote.id,
        },
      });
    } else {
      await prisma.reviewVote.update({
        where: {
          id: vote.id,
        },
        data: {
          voteType: mapVoteType(interaction),
        },
      });
      myInteraction = mapVoteType(interaction);
    }

    const [likeCount, dislikeCount] = await Promise.all([
      prisma.reviewVote.count({
        where: {
          reviewId,
          voteType: mapVoteType("LIKE"),
        },
      }),
      prisma.reviewVote.count({
        where: {
          reviewId,
          voteType: mapVoteType("DISLIKE"),
        },
      }),
    ]);

    return {
      id: reviewId,
      likeCount,
      dislikeCount,
      myInteraction,
      isOwner: review.userId === userId,
    };
  },
  editReview: async (
    userId: string,
    reviewId: string,
    body: EditReviewBodySchema,
  ) => {
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new Error("REVIEW_NOT_FOUND");
    }

    if (review.userId !== userId) {
      throw new Error("NOT_REVIEW_OWNER");
    }

    const semester = mapSemester(body.semester);

    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
        userId: userId,
      },
      data: {
        ...body,
        semester,
      },
    });

    return {
      id: reviewId,
      academicYear: updatedReview.academicYear,
      semester: semesterToNumber[updatedReview.semester],
      rating: updatedReview.rating,
      content: updatedReview.content,
      isOwner: true,
      updatedAt: updatedReview.updatedAt,
    };
  },
  deleteReview: async (userId: string, reviewId: string) => {
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new Error("REVIEW_NOT_FOUND");
    }

    if (review.userId !== userId) {
      throw new Error("NOT_REVIEW_OWNER");
    }

    await prisma.review.delete({
      where: {
        id: reviewId,
        userId: userId,
      },
    });

    return {
      id: reviewId,
      status: "DELETED",
    };
  },
};
