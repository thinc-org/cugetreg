import { Course, Section } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

import { CourseGroup } from '@/common/hooks/useCourseGroup/types'

import { COURSE_DATA_FIELDS } from './courseDataField'

export interface GetCourseVars {
  courseNo: string
  courseGroup: CourseGroup
}

export interface GetCourseResponse {
  course: Course
}

export const GET_COURSE = gql`
query GetCourseInfo($courseNo: String!, $courseGroup: CourseGroupInput!) {
  course(courseNo: $courseNo, courseGroup: $courseGroup) {
    ${COURSE_DATA_FIELDS}
  }
}
`
