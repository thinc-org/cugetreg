import { Review, ReviewInteraction } from '@/common/types/reviews'

export type ReviewState = Pick<Review, 'rating' | 'academicYear' | 'semester' | 'content'>

export interface ReviewContextValues {
  reviews: Review[]
  myPendingReviews: Review[]
  setInteraction: (reviewId: string, interaction: ReviewInteraction) => void
  reportReview: (reviewId: string) => void
  deleteMyPendingReview: (reviewId: string) => void
  editMyReview: (reviewId: string) => void
  submitReview: () => void
  submitEditedReview: (reviewId: string) => void
  editingReviewId?: string
}
