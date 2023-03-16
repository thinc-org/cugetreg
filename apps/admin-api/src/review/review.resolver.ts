import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { ReviewDocument } from '@admin-api/schemas/review.schema'

import { Review, ReviewStatus } from '../graphql'
import { ReviewService } from './review.service'

@Resolver('Review')
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query('reviews')
  async getReviews(): Promise<ReviewDocument[]> {
    return this.reviewService.getReviews()
  }

  @Query('pendingReviews')
  async getPending(): Promise<Review[]> {
    return this.reviewService.getPending()
  }

  @Mutation('setReviewStatus')
  async setStatus(
    @Args('reviewId') reviewId: string,
    @Args('status') status: ReviewStatus,
    @Args('rejectionReason') rejectionReason?: string
  ): Promise<string> {
    return this.reviewService.setStatus(reviewId, status, rejectionReason)
  }
}
