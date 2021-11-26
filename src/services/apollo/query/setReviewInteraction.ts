import gql from 'graphql-tag'

import { Review, ReviewInteraction } from '@/common/types/reviews'

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
      _id
      rating
      courseNo
      semester
      academicYear
      studyProgram
      content
      likeCount
      dislikeCount
      myInteraction
    }
  }
`
