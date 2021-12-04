import { ReviewContextValues } from './types'

export const DEFAULT_REVIEW_CONTEXT_VALUE: ReviewContextValues = {
  reviews: [],
  myPendingReviews: [],
  setInteraction: () => {},
  reportReview: () => {},
  deleteMyReview: () => {},
  editMyReview: () => {},
  cancelEditReview: () => {},
  submitReview: () => {},
  submitEditedReview: () => {},
}
