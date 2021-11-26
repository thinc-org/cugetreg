import gql from 'graphql-tag'

import { Review, ReviewInteraction } from '@/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@/services/apollo/query/reviewDataField'

export interface SetReviewInteractionVars {
  reviewId: string
  interaction: ReviewInteraction
}

export interface SetReviewInteractionResponse {
  setInteraction: Review
}

export const SET_REVIEW_INTERACTION = gql`
  mutation setInteraction($reviewId: String!, $interaction: Interaction!) {
    setInteraction(reviewId: $reviewId, interaction: $interaction) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`