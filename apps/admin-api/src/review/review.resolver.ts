import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Review, ReviewStatus } from '../graphql'
import { ReviewService } from './review.service'

@Resolver('Review')
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  // @UseGuards(AdminAuthGuard)
  @Query('pendingReviews')
  async getPending(): Promise<Review[]> {
    return this.reviewService.getPending()
  }

  // @UseGuards(AdminAuthGuard)
  @Mutation('setReviewStatus')
  async setStatus(
    @Args('reviewId') reviewId: string,
    @Args('status') status: ReviewStatus,
    @Args('rejectionReason') rejectionReason?: string
  ): Promise<string> {
    return this.reviewService.setStatus(reviewId, status, rejectionReason)
  }
}
