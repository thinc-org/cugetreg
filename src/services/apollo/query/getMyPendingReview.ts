import { StudyProgram } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

import { Review } from '@/common/types/reviews'
import { REVIEW_DATA_FIELDS } from '@/services/apollo/template/reviewDataField'

export interface GetMyPendingReviewsVars {
  courseNo: string
  studyProgram: StudyProgram
}

export interface GetMyPendingReviewsResponse {
  myPendingReviews: Review[]
}

export const GET_MY_PENDING_REVIEWS = gql`
  query myPendingReviews($courseNo: String!, $studyProgram: StudyProgram!) {
    myPendingReviews(courseNo: $courseNo, studyProgram: $studyProgram) {
      ${REVIEW_DATA_FIELDS}
    }
  }
`
