import gql from 'graphql-tag'

import { Review } from '@/common/types/reviews'

export interface RemoveReviewVars {
  reviewId: string
}

export interface RemoveReviewResponse {
  removeReview: Review
}

export const REMOVE_REVIEW = gql`
  mutation removeReview($reviewId: String!) {
    removeReview(reviewId: $reviewId) {
      _id
      rating
      courseNo
      semester
      academicYear
      studyProgram
      content
      likeCount
      dislikeCount
      hasLiked
      hasDisliked
    }
  }
`
