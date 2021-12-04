import gql from 'graphql-tag'

import { Review, ReviewInteractionType } from '@/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@/services/apollo/query/reviewDataField'

export interface SetReviewInteractionVars {
  reviewId: string
  interaction: ReviewInteractionType
}

export interface SetReviewInteractionResponse {
  setInteraction: Review
}

export const SET_REVIEW_INTERACTION = gql`
  mutation setInteraction($reviewId: String!, $interaction: ReviewInteractionType!) {
    setInteraction(reviewId: $reviewId, interaction: $interaction) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`
