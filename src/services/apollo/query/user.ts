import { gql } from '@apollo/client'

export const ME = gql`
  query Me {
    me {
      _id
      name
    }
  }
`

export interface MeResponse {
  me: {
    _id: string
    name: string
  }
}

export const MODIFY_COURSE_CART = gql`
  mutation PushCourseCart($items: [CourseCartItemInput!]!) {
    modifyCourseCart(newContent: $items) {
      courseNo
    }
  }
`

export const GET_COURSE_CART = gql`
  query GetCourseCart {
    courseCart {
      studyProgram
      academicYear
      courseNo
      semester
      selectedSectionNo
      isHidden
    }
  }
`
