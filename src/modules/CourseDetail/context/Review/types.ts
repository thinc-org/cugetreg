import { Review, ReviewInteraction } from '@/common/types/reviews'

export interface ReviewContextValues {
  reviews: Review[]
  myPendingReviews: Review[]
  setInteraction: (reviewId: string, interaction: ReviewInteraction) => void
  reportReview: (reviewId: string) => void
  deleteMyPendingReview: (reviewId: string) => void
}
