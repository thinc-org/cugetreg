import { prisma } from "../db/clients.js";
import { Prisma } from "../generated/prisma/client.js";
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
    const course = await prisma.course.findFirst({
      where: {
        courseNo: newReview.courseNo,
      },
    });

    if (!course) {
      throw new Error("COURSE_NOT_FOUND");
    }

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
    return prisma.$transaction(
      async (tx) => {
        const [review, vote] = await Promise.all([
          tx.review.findFirst({
            where: {
              id: reviewId,
            },
          }),
          tx.reviewVote.findFirst({
            where: {
              userId,
              reviewId,
            },
          }),
        ]);

        if (!review) {
          throw new Error("REVIEW_NOT_FOUND");
        }

        let myInteraction: string | VoteType | null = null;

        if (!vote) {
          await tx.reviewVote.create({
            data: {
              reviewId,
              userId,
              voteType: mapVoteType(interaction),
            },
          });
          myInteraction = mapVoteType(interaction);
        } else if (vote.voteType === mapVoteType(interaction)) {
          await tx.reviewVote.delete({
            where: {
              id: vote.id,
            },
          });
        } else {
          await tx.reviewVote.update({
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
          tx.reviewVote.count({
            where: {
              reviewId,
              voteType: mapVoteType("LIKE"),
            },
          }),
          tx.reviewVote.count({
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
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
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
