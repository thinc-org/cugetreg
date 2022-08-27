import gql from 'graphql-tag'

import { Review } from '@web/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@web/services/apollo/query/reviewDataField'

export interface RemoveReviewVars {
  reviewId: string
}

export interface RemoveReviewResponse {
  removeReview: Review
}

export const REMOVE_REVIEW = gql`
  mutation removeReview($reviewId: String!) {
    removeReview(reviewId: $reviewId) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`
