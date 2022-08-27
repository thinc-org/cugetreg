import { Course } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

import { CourseGroup } from '@web/common/hooks/useCourseGroup/types'

export interface GetAllCoursesVars {
  courseNo: string
  courseGroup: CourseGroup
}

export interface GetAllCoursesResponse {
  search: Pick<Course, 'courseNo'>[]
}

export const GET_ALL_COURSES = gql`
  query Search($filter: FilterInput!, $courseGroup: CourseGroupInput!) {
    search(filter: $filter, courseGroup: $courseGroup) {
      courseNo
    }
  }
`
