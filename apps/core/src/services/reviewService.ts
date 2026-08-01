import { prisma } from "@/db/clients.js";
import { Prisma } from "@/generated/prisma/client.js";
import type { VoteType } from "@/generated/prisma/enums.js";
import {
  mapReviewStatus,
  mapSemester,
  mapStudyProgram,
  mapVoteType,
} from "@/utils/enumMapper.js";

import type {
  EditReviewBodySchema,
  SubmitReviewBodySchema,
  VoteReviewBodySchema,
} from "@cugetreg/zod-schemas/reviews";

export const reviewService = {
  submitReview: async (userId: string, newReview: SubmitReviewBodySchema) => {
    return prisma.$transaction(async (tx) => {
      const course = await tx.course.findFirst({
        where: {
          courseNo: newReview.courseNo,
        },
      });

      if (!course) {
        throw new Error("COURSE_NOT_FOUND");
      }

      if (newReview.sectionNo !== undefined) {
        const section = await tx.section.findFirst({
          where: {
            sectionNo: newReview.sectionNo,
            course: {
              courseNo: newReview.courseNo,
              studyProgram: mapStudyProgram(newReview.studyProgram),
              academicYear: newReview.academicYear,
              semester: mapSemester(newReview.semester),
            },
          },
        });

        if (!section) {
          throw new Error("SECTION_NOT_FOUND");
        }
      }

      const createdReview = await tx.review.create({
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
        semester: createdReview.semester,
        status: createdReview.status,
        likeCount: 0,
        dislikeCount: 0,
        isOwner: true,
        createdAt: createdReview.createdAt,
      };
    });
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

        let myInteraction: VoteType | null = null;

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

    if (body.sectionNo !== undefined) {
      const section = await prisma.section.findFirst({
        where: {
          sectionNo: body.sectionNo,
          course: {
            courseNo: review.courseNo,
            studyProgram: review.studyProgram,
            academicYear: body.academicYear,
            semester: mapSemester(body.semester),
          },
        },
      });

      if (!section) {
        throw new Error("SECTION_NOT_FOUND");
      }
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
        status: mapReviewStatus("PENDING"),
      },
    });

    return {
      id: reviewId,
      academicYear: updatedReview.academicYear,
      semester: updatedReview.semester,
      sectionNo: updatedReview.sectionNo,
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
