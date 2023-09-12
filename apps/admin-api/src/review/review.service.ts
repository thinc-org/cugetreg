import { UserInputError } from '@nestjs/apollo'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'

import { IncomingWebhook } from '@slack/webhook'
import { Model, Types } from 'mongoose'

import { BadRequestError, NotFoundError } from '@admin-api/common/errors'

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
  private logger: Logger = new Logger('ReviewService')
  private webhook: IncomingWebhook

  constructor(
    private configService: ConfigService,
    @InjectModel('review') private reviewModel: Model<Review>
  ) {
    const env = this.configService.get<string>('env')
    const url = this.configService.get<string>('slackWebhookUrl')
    if (url && env == 'production') {
      this.logger.log(`Slack webhook is configured: ${url}`)
      this.webhook = new IncomingWebhook(url)
    }
  }

  async sendReviewAlert(review: ReviewDocument) {
    if (!this.webhook) {
      return
    }
    const reviewDashboardUrl = this.configService.get<string>('reviewDashboardUrl')
    this.logger.log(`sent alert`)
    return this.webhook.send({
      text: `A new review is created for course ${review.courseNo} ${review.studyProgram} ${review.semester}/${review.academicYear}. Review them now in <${reviewDashboardUrl}|Review Dashboard>.`,
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

    const newReview = new this.reviewModel({
      ownerId: new Types.ObjectId(userId),
      courseNo,
      semester,
      academicYear,
      studyProgram,
      rating,
      content,
      status: 'PENDING',
    })
    await newReview.save()
    await this.sendReviewAlert(newReview)
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
    const newReview = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          ...reviewInput,
          status: 'PENDING',
        },
      },
      { new: true }
    )
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
  ): Promise<string> {
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
    return `${status}`
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
