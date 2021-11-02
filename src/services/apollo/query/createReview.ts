import { gql } from '@apollo/client'
import { Semester, StudyProgram } from '@thinc-org/chula-courses'

import { Review } from '@/common/types/reviews'

export interface CreateReviewVars {
  rating: number
  courseNo: string
  semester: Semester
  academicYear: string
  studyProgram: StudyProgram
  content: string
}

export interface CreateReviewResponse {
  createReview: Review
}

export const CREATE_REVIEW = gql`
  mutation createReview($createReviewInput: CreateReviewInput!) {
    createReview(createReviewInput: $createReviewInput) {
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
