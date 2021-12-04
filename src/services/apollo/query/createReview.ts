import { gql } from '@apollo/client'
import { Semester, StudyProgram } from '@thinc-org/chula-courses'

import { Review } from '@/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@/services/apollo/query/reviewDataField'

export interface CreateReviewVars {
  createReviewInput: {
    rating: number
    courseNo: string
    semester: Semester
    academicYear: string
    studyProgram: StudyProgram
    content: string
  }
}

export interface CreateReviewResponse {
  createReview: Review
}

export const CREATE_REVIEW = gql`
  mutation CreateReview($createReviewInput: CreateReviewInput!) {
    createReview(createReviewInput: $createReviewInput) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`
