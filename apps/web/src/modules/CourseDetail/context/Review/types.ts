import { RefObject } from 'react'

import { TNode } from '@udecode/plate-core'
import { ReviewFormRef } from '@web/modules/CourseDetail/components/ReviewForm/types'

import { Review } from '@cgr/codegen'
import { ReviewInteractionType } from '@cgr/codegen'

export type ReviewState = Pick<Review, 'rating' | 'academicYear' | 'semester'> & {
  content: TNode[]
}

export interface ReviewContextValues {
  courseNo: string
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
  formRef: RefObject<ReviewFormRef | undefined>
  formLoaded: boolean
  onFormLoad: () => void
}

export interface ReviewProviderProps {
  courseNo: string
  initialReviews: Review[]
  children?: React.ReactNode
}
