import { TNode } from '@udecode/plate'

import { Review, ReviewInteractionType } from '@/common/types/reviews'

export type ReviewState = Pick<Review, 'rating' | 'academicYear' | 'semester'> & {
  content: TNode[]
}

export interface ReviewContextValues {
  reviews: Review[]
  myPendingReviews: Review[]
  setInteraction: (reviewId: string, interaction: ReviewInteractionType) => void
  reportReview: (reviewId: string) => void
  deleteMyReview: (reviewId: string) => void
  editMyReview: (reviewId: string) => void
  cancelEditReview: () => void
  submitReview: () => void
  submitEditedReview: (reviewId: string) => void
  editingReviewId?: string
}
