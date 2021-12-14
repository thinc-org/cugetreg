import gql from 'graphql-tag'

import { Review } from '@/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@/services/apollo/query/reviewDataField'

export interface EditMyReviewVars {
  reviewId: string
  review: Pick<Review, 'rating' | 'semester' | 'academicYear' | 'content'>
}

export interface EditMyReviewResponse {
  editMyReview: Review
}

export const EDIT_MY_REVIEW = gql`
  mutation editMyReview($reviewId: String!, $review: EditReviewInput!) {
    editMyReview(reviewId: $reviewId, review: $review) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`
