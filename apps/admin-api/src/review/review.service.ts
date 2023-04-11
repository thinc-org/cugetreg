import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'

import { StudyProgram as GraphQLStudyProgram, Review, ReviewStatus } from '../graphql'
import { ReviewDocument } from '../schemas/review.schema'

@Injectable()
export class ReviewService {
  constructor(@InjectModel('review') private reviewModel: Model<ReviewDocument>) {}

  async getReviews(): Promise<ReviewDocument[]> {
    const reviews = await this.reviewModel.find()
    return reviews
  }

  async getPending(): Promise<Review[]> {
    const reviews = await this.reviewModel.find({
      status: ReviewStatus.PENDING,
    })
    return reviews.map((rawReview) => this.transformReview(rawReview, null))
  }

  // TODO: hide reviews?
  async setStatus(
    reviewId: string,
    status: ReviewStatus,
    rejectionReason: string = null
  ): Promise<string> {
    if (status !== ReviewStatus.APPROVED && status !== ReviewStatus.REJECTED) {
      throw new BadRequestException({
        reason: 'INVALID_STATUS',
        message: 'Only APPROVED and REJECTED status is supported',
      })
    }
    const review = await this.reviewModel.findByIdAndUpdate(reviewId, {
      $set: {
        status,
        rejectionReason,
      },
    })
    if (!review) {
      throw new NotFoundException({
        reason: 'REVIEW_NOT_FOUND',
        message: `Error setting status for review ${reviewId}: Review not found`,
      })
    }
    return 'Review status updated successfully'
  }

  private transformReview(rawReview: ReviewDocument, userId: string): Review {
    const likeCount = rawReview.interactions.filter(
      (interaction) => interaction.type === 'L'
    ).length
    const dislikeCount = rawReview.interactions.length - likeCount
    const interactionType = rawReview.interactions.find((interaction) =>
      interaction.userId.equals(userId)
    )?.type

    // TODO: change course title
    return {
      _id: rawReview._id.toString(),
      rating: rawReview.rating,
      courseNo: rawReview.courseNo,
      semester: rawReview.semester,
      academicYear: rawReview.academicYear,
      studyProgram: rawReview.studyProgram as GraphQLStudyProgram,
      content: rawReview.content,
      likeCount: likeCount,
      dislikeCount: dislikeCount,
      myInteraction: interactionType,
      status: rawReview.status,
      rejectionReason: rawReview.rejectionReason,
      isOwner: rawReview.ownerId.equals(userId),
      courseTitle: 'demo',
    }
  }
}
