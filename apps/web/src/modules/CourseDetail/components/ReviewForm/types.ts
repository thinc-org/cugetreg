import { Review } from '@cgr/codegen'
import { ReviewState } from '@web/modules/CourseDetail/context/Review/types'

export type ReviewEditables = Pick<Review, 'rating' | 'academicYear' | 'semester' | 'content'>

export interface ReviewFormRef {
  clearForm: () => void
  storeLocalReviewForm: () => void
  restoreFormState: (form: Partial<ReviewState>) => void
  applyFromReview: (review: Review) => void
  toReview: () => ReviewEditables
}
