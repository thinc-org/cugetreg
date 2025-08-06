import { UserInputError } from '@nestjs/apollo'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'

import { Model, Types } from 'mongoose'

import { BadRequestError, NotFoundError } from '@api/common/errors'
import { DiscordService } from '@api/common/services/discord.service'
import { OpenAIService } from '@api/common/services/openai.service'
import { Configuration } from '@api/config/configuration'

import {
  Review,
  ReviewDocument,
  ReviewInteractionType,
  ReviewStatus,
  StudyProgram,
} from '@cgr/schema'

import { CreateReviewInput, EditReviewInput } from '../graphql'

@Injectable()
export class ReviewService {
  private reviewDashboardUrl: string

  constructor(
    private configService: ConfigService<Configuration>,
    @InjectModel('review') private reviewModel: Model<Review>,
    private openaiService: OpenAIService,
    private discordService: DiscordService
  ) {
    this.reviewDashboardUrl = this.configService.get<string>('reviewDashboardUrl')
  }

  async sendReviewAlert(review: ReviewDocument, status: ReviewStatus, isEdit: boolean) {
    if (!this.discordService.isAvailable()) {
      return
    }

    return this.discordService.sendMessage({
      embeds: [
        {
          title:
            status === 'APPROVED'
              ? 'Review Auto-Approved'
              : status === 'REJECTED'
                ? 'Review Auto-Rejected'
                : ':warning: Manual Review Pending',
          description: isEdit ? 'A review has been edited' : 'A new review has been created',
          fields: [
            {
              name: 'Course No',
              value: review.courseNo,
              inline: true,
            },
            {
              name: 'Semester',
              value: `${review.studyProgram} ${review.semester}/${review.academicYear}`,
              inline: true,
            },
            {
              name: 'Dashboard Link',
              value: `[Click Here](${this.reviewDashboardUrl})`,
              inline: true,
            },
            {
              name: 'Content (First 100 characters)',
              value: review.content.substring(0, 100) + (review.content.length > 100 ? '...' : ''),
            },
          ],
          color: status === 'APPROVED' ? 0x00ff00 : status === 'REJECTED' ? 0xff0000 : 0xffff00,
          footer: {
            text: `Review ID: ${review._id.toString()}`,
          },
        },
      ],
    })
  }

  async getReviews(): Promise<ReviewDocument[]> {
    const reviews = await this.reviewModel.find()
    return reviews
  }

  async create(
    { courseNo, semester, academicYear, studyProgram, rating, content }: CreateReviewInput,
    userId: string
  ): Promise<ReviewDocument> {
    if (rating < 0 || rating > 10) {
      throw new UserInputError(`Rating must be between 0 and 10. Got ${rating}`)
    }

    const review = await this.reviewModel.findOne({
      ownerId: userId,
      courseNo,
      studyProgram,
    })
    if (review) {
      throw new BadRequestError('User already created a review for this course.')
    }

    const moderationResult = await this.openaiService.moderateContent(content)
    const reviewStatus =
      moderationResult === 'NOT_FLAGGED'
        ? 'APPROVED'
        : moderationResult === 'FLAGGED'
          ? 'REJECTED'
          : 'PENDING'

    const newReview = new this.reviewModel({
      ownerId: new Types.ObjectId(userId),
      courseNo,
      semester,
      academicYear,
      studyProgram,
      rating,
      content,
      status: reviewStatus,
      rejectionReason:
        reviewStatus === 'REJECTED'
          ? 'รีวิวนี้มีเนื้อหาที่ไม่เหมาะสม (จากการตรวจสอบด้วย AI) โปรดติดต่อเราหากคิดว่านี่เป็นข้อผิดพลาด'
          : undefined,
    })
    await newReview.save()

    await this.sendReviewAlert(newReview, reviewStatus, false)

    return newReview
  }

  async getApprovedReviews(
    courseNo: string,
    studyProgram: StudyProgram,
    userId: string
  ): Promise<ReviewDocument[]> {
    const reviews = await this.reviewModel.find({
      courseNo,
      studyProgram,
      status: 'APPROVED',
    })
    return reviews.sort((reviewA, reviewB) => {
      if (reviewA.ownerId.equals(userId)) {
        return -1
      }
      if (reviewB.ownerId.equals(userId)) {
        return 1
      }
      // Sort by _id descending
      return reviewB._id.toString().localeCompare(reviewA._id.toString())
    })
  }

  async getPending(): Promise<ReviewDocument[]> {
    const reviews = await this.reviewModel.find({
      status: 'PENDING',
    })
    return reviews
  }

  async getPendingForUser(
    courseNo: string,
    studyProgram: StudyProgram,
    userId: string
  ): Promise<ReviewDocument[]> {
    const reviews = await this.reviewModel.find({
      $or: [{ status: 'PENDING' }, { status: 'REJECTED' }],
      ownerId: userId,
      courseNo,
      studyProgram,
    })
    return reviews
  }

  async editMyReview(
    reviewId: string,
    reviewInput: EditReviewInput,
    userId: string
  ): Promise<ReviewDocument> {
    if (reviewInput.rating != null && (reviewInput.rating < 0 || reviewInput.rating > 10)) {
      throw new UserInputError(`Rating must be between 0 and 10. Got ${reviewInput.rating}`)
    }

    const review = await this.reviewModel.findById(reviewId)
    if (!review) {
      throw new NotFoundError('Review with the given id does not exist.')
    }
    if (!review.ownerId.equals(userId)) {
      throw new BadRequestError('User is not owner of this review.')
    }

    const moderationResult = await this.openaiService.moderateContent(reviewInput.content)
    const reviewStatus =
      moderationResult === 'NOT_FLAGGED'
        ? 'APPROVED'
        : moderationResult === 'FLAGGED'
          ? 'REJECTED'
          : 'PENDING'

    const newReview = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          ...reviewInput,
          status: reviewStatus,
          rejectionReason:
            reviewStatus === 'REJECTED'
              ? 'รีวิวนี้มีเนื้อหาที่ไม่เหมาะสม (จากการตรวจสอบด้วย AI) โปรดติดต่อเราหากคิดว่านี่เป็นข้อผิดพลาด'
              : undefined,
        },
      },
      { new: true }
    )

    await this.sendReviewAlert(newReview, reviewStatus, true)

    return newReview
  }

  async remove(reviewId: string, userId: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findOneAndDelete({
      _id: reviewId,
      ownerId: userId,
    })
    if (!review) {
      throw new NotFoundError(
        'Either the review does not exist or the user is not the owner of the review'
      )
    }
    return review
  }

  async setStatus(
    reviewId: string,
    status: ReviewStatus,
    rejectionReason: string = null
  ): Promise<ReviewDocument> {
    if (status !== 'APPROVED' && status !== 'REJECTED') {
      throw new UserInputError(`Only APPROVED and REJECTED status is supported. Got ${status}`)
    }
    const review = await this.reviewModel.findByIdAndUpdate(reviewId, {
      $set: {
        status,
        rejectionReason,
      },
    })
    if (!review) {
      throw new NotFoundError('Review with the given id does not exist.')
    }
    return review
  }

  async setInteraction(
    reviewId: string,
    interaction: ReviewInteractionType,
    userId: string
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(reviewId)
    if (!review) {
      throw new NotFoundError('Review with the given id does not exist.')
    }

    const index = review.interactions.findIndex((interaction) => interaction.userId.equals(userId))
    if (index === -1) {
      review.interactions.push({
        userId: new Types.ObjectId(userId),
        type: interaction,
      })
    } else if (review.interactions[index].type === interaction) {
      review.interactions[index].remove()
    } else {
      review.interactions[index].set('type', interaction)
    }

    await review.save()
    return review
  }
}
