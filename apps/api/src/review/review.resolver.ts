import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { StudyProgram } from '@thinc-org/chula-courses'

import { AdminAuthGuard } from '../auth/admin.guard'
import { JwtAuthGuard, JwtAuthGuardOptional } from '../auth/jwt.guard'
import { CurrentUser } from '../common/decorators/currentUser.decorator'
import {
  CreateReviewInput,
  EditReviewInput,
  Review,
  ReviewInteractionType,
  ReviewStatus,
} from '../graphql'
import { ReviewService } from './review.service'

@Resolver('Review')
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuardOptional)
  @Query('reviews')
  async find(
    @Args('courseNo') courseNo: string,
    @Args('studyProgram') studyProgram: StudyProgram,
    @CurrentUser() userId: string
  ): Promise<Review[]> {
    return this.reviewService.getApprovedReviews(courseNo, studyProgram, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('createReview')
  async create(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser() userId: string
  ): Promise<Review> {
    return this.reviewService.create(createReviewInput, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('removeReview')
  async remove(@Args('reviewId') reviewId: string, @CurrentUser() userId: string): Promise<Review> {
    return this.reviewService.remove(reviewId, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('setReviewInteraction')
  async like(
    @Args('reviewId') reviewId: string,
    @Args('interactionType') interactionType: ReviewInteractionType,
    @CurrentUser() userId: string
  ): Promise<Review> {
    return this.reviewService.setInteraction(reviewId, interactionType, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Query('myPendingReviews')
  async getMyPendingReviews(
    @Args('courseNo') courseNo: string,
    @Args('studyProgram') studyProgram: StudyProgram,
    @CurrentUser() userId: string
  ): Promise<Review[]> {
    return this.reviewService.getPendingForUser(courseNo, studyProgram, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('editMyReview')
  async editMyPendingReview(
    @Args('reviewId') reviewId: string,
    @Args('review') review: EditReviewInput,
    @CurrentUser() userId: string
  ): Promise<Review> {
    return this.reviewService.editMyReview(reviewId, review, userId)
  }

  @UseGuards(AdminAuthGuard)
  @Query('pendingReviews')
  async getPending(): Promise<Review[]> {
    return this.reviewService.getPending()
  }

  @UseGuards(AdminAuthGuard)
  @Mutation('setReviewStatus')
  async setStatus(
    @Args('reviewId') reviewId: string,
    @Args('status') status: ReviewStatus,
    @Args('rejectionReason') rejectionReason?: string
  ): Promise<string> {
    return this.reviewService.setStatus(reviewId, status, rejectionReason)
  }
}
