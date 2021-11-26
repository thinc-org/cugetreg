import { StudyProgram } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

import { Review } from '@/common/types/reviews'

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
