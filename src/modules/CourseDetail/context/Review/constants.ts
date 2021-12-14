import { createRef } from 'react'

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
  editorRef: createRef(),
}

export const REVIEW_FORM_ID = 'REVIEW_FORM'
