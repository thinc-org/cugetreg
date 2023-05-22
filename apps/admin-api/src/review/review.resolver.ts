import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { ReviewDocument } from '@cgr/schema'

import { Review as GraphQLReview, ReviewStatus } from '../graphql'
import { ReviewService } from './review.service'

@Resolver('Review')
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query('reviews')
  async getReviews(): Promise<GraphQLReview[]> {
    const reviews = await this.reviewService.getReviews()
    return reviews.map((review) => this.toGraphQLReview(review))
  }

  @Query('pendingReviews')
  async getPending(): Promise<GraphQLReview[]> {
    const reviews = await this.reviewService.getPending()
    return reviews.map((review) => this.toGraphQLReview(review))
  }

  @Mutation('setReviewStatus')
  async setStatus(
    @Args('reviewId') reviewId: string,
    @Args('status') status: ReviewStatus,
    @Args('rejectionReason') rejectionReason?: string
  ): Promise<GraphQLReview> {
    return this.toGraphQLReview(
      await this.reviewService.setStatus(reviewId, status, rejectionReason)
    )
  }

  private toGraphQLReview(rawReview: ReviewDocument): GraphQLReview {
    const likeCount = rawReview.interactions.filter(
      (interaction) => interaction.type === 'L'
    ).length
    const dislikeCount = rawReview.interactions.length - likeCount
    return {
      _id: rawReview._id.toString(),
      rating: rawReview.rating,
      courseNo: rawReview.courseNo,
      courseTitle: 'demo',
      semester: rawReview.semester,
      academicYear: rawReview.academicYear,
      studyProgram: rawReview.studyProgram,
      content: rawReview.content,
      likeCount: likeCount,
      dislikeCount: dislikeCount,
      myInteraction: null, // null because admin can't match owner
      status: rawReview.status,
      rejectionReason: rawReview.rejectionReason,
      isOwner: false, // null because admin can't match owner
    }
  }
}
