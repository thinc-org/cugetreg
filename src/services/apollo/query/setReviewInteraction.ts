import gql from 'graphql-tag'

import { Review, ReviewInteractionType } from '@/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@/services/apollo/query/reviewDataField'

export interface SetReviewInteractionVars {
  reviewId: string
  interactionType: ReviewInteractionType
}

export interface SetReviewInteractionResponse {
  setReviewInteraction: Review
}

export const SET_REVIEW_INTERACTION = gql`
  mutation setReviewInteraction($reviewId: String!, $interactionType: ReviewInteractionType!) {
    setReviewInteraction(reviewId: $reviewId, interactionType: $interactionType) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`
