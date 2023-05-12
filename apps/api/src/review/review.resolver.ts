import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Review, ReviewInteractionType, ReviewStatus, StudyProgram } from '@cgr/schema'

import { AdminAuthGuard } from '../auth/admin.guard'
import { JwtAuthGuard, JwtAuthGuardOptional } from '../auth/jwt.guard'
import { CurrentUser } from '../common/decorators/currentUser.decorator'
import { CreateReviewInput, EditReviewInput, Review as GraphQLReview } from '../graphql'
import { ReviewService } from './review.service'

// TODO: remove admin functionality when admin-api is done
@Resolver('Review')
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuardOptional)
  @Query('reviews')
  async find(
    @Args('courseNo') courseNo: string,
    @Args('studyProgram') studyProgram: StudyProgram,
    @CurrentUser() userId: string
  ): Promise<GraphQLReview[]> {
    const reviews = await this.reviewService.getApprovedReviews(courseNo, studyProgram, userId)
    return reviews.map((review) => this.toGraphQLReview(review, userId))
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('createReview')
  async create(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @CurrentUser() userId: string
  ): Promise<GraphQLReview> {
    return this.toGraphQLReview(await this.reviewService.create(createReviewInput, userId), userId)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('removeReview')
  async remove(
    @Args('reviewId') reviewId: string,
    @CurrentUser() userId: string
  ): Promise<GraphQLReview> {
    return this.toGraphQLReview(await this.reviewService.remove(reviewId, userId), userId)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('setReviewInteraction')
  async like(
    @Args('reviewId') reviewId: string,
    @Args('interactionType') interactionType: ReviewInteractionType,
    @CurrentUser() userId: string
  ): Promise<GraphQLReview> {
    return this.toGraphQLReview(
      await this.reviewService.setInteraction(reviewId, interactionType, userId),
      userId
    )
  }

  @UseGuards(JwtAuthGuard)
  @Query('myPendingReviews')
  async getMyPendingReviews(
    @Args('courseNo') courseNo: string,
    @Args('studyProgram') studyProgram: StudyProgram,
    @CurrentUser() userId: string
  ): Promise<GraphQLReview[]> {
    const reviews = await this.reviewService.getPendingForUser(courseNo, studyProgram, userId)
    return reviews.map((review) => this.toGraphQLReview(review, userId))
  }

  @UseGuards(JwtAuthGuard)
  @Mutation('editMyReview')
  async editMyPendingReview(
    @Args('reviewId') reviewId: string,
    @Args('review') review: EditReviewInput,
    @CurrentUser() userId: string
  ): Promise<GraphQLReview> {
    return this.toGraphQLReview(
      await this.reviewService.editMyReview(reviewId, review, userId),
      userId
    )
  }

  @UseGuards(AdminAuthGuard)
  @Query('pendingReviews')
  async getPending(): Promise<GraphQLReview[]> {
    const reviews = await this.reviewService.getPending()
    return reviews.map((review) => this.toGraphQLReview(review, null))
  }

  @UseGuards(AdminAuthGuard)
  @Mutation('setReviewStatus')
  async setStatus(
    @Args('reviewId') reviewId: string,
    @Args('status') status: ReviewStatus,
    @Args('rejectionReason') rejectionReason?: string
  ): Promise<GraphQLReview> {
    return this.toGraphQLReview(
      await this.reviewService.setStatus(reviewId, status, rejectionReason),
      null
    )
  }

  private toGraphQLReview(rawReview: Review, userId: string): GraphQLReview {
    const likeCount = rawReview.interactions.filter(
      (interaction) => interaction.type === 'L'
    ).length
    const dislikeCount = rawReview.interactions.length - likeCount
    const interactionType = rawReview.interactions.find((interaction) =>
      interaction.userId.equals(userId)
    )?.type
    return {
      _id: rawReview._id.toString(),
      rating: rawReview.rating,
      courseNo: rawReview.courseNo,
      semester: rawReview.semester,
      academicYear: rawReview.academicYear,
      studyProgram: rawReview.studyProgram,
      content: rawReview.content,
      likeCount: likeCount,
      dislikeCount: dislikeCount,
      myInteraction: interactionType,
      status: rawReview.status,
      rejectionReason: rawReview.rejectionReason,
      isOwner: rawReview.ownerId.equals(userId),
    }
  }
}
