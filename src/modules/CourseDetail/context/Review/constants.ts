import { ReviewContextValues } from './types'

export const DEFAULT_REVIEW_CONTEXT_VALUE: ReviewContextValues = {
  reviews: [],
  myPendingReviews: [],
  setInteraction: () => {},
  reportReview: () => {},
  deleteMyPendingReview: () => {},
  submitReview: () => {},
}
