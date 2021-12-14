import { TNode } from '@udecode/plate-core'

import { RefObject } from 'react'

import { RichTextEditorRef } from '@/common/components/RichTextEditor/types'
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
  editorRef: RefObject<RichTextEditorRef | undefined>
}

export interface ReviewProviderProps {
  courseNo: string
  initialReviews: Review[]
}
