import { StudyProgram } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

import { Review } from '@/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@/services/apollo/template/reviewDataField'

export interface GetReviewsVars {
  courseNo: string
  studyProgram: StudyProgram
}

export interface GetReviewsResponse {
  reviews: Review[]
}

export const GET_REVIEWS = gql`
  query reviews($courseNo: String!, $studyProgram: StudyProgram!) {
    reviews(courseNo: $courseNo, studyProgram: $studyProgram) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`
