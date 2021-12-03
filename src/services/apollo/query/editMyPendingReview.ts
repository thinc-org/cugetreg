import gql from 'graphql-tag'

import { Review } from '@/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@/services/apollo/query/reviewDataField'

export interface EditMyPendingReviewVars {
  reviewId: string
  review: Pick<Review, 'rating' | 'semester' | 'academicYear' | 'content'>
}

export interface EditMyPendingReviewResponse {
  editMyPendingReview: Review[]
}

export const EDIT_MY_PENDING_REVIEW = gql`
  mutation editMyPendingReview($reviewId: String!, $review: EditReviewInput!) {
    editMyPendingReview(reviewId: $reviewId, review: $review) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`
