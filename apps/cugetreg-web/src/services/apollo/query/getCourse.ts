import { Class, Course, Section } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

import { CourseGroup } from '@web/common/hooks/useCourseGroup/types'

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

export type ClassThumbnailData = Pick<Class, 'dayOfWeek'>
export type SectionThumbnailData = Pick<Section, never> & {
  classes: ClassThumbnailData[]
}
export type CourseThumbnailData = Pick<
  Course,
  'courseNo' | 'abbrName' | 'courseNameTh' | 'courseNameEn' | 'genEdType'
> & {
  sections: SectionThumbnailData[]
}

export interface GetCourseForThumbnailResponse {
  course: CourseThumbnailData
}

export const GET_COURSE_FOR_THUMBNAIL = gql`
  query GetCourseInfo($courseNo: String!, $courseGroup: CourseGroupInput!) {
    course(courseNo: $courseNo, courseGroup: $courseGroup) {
      courseNo
      abbrName
      courseNameTh
      courseNameEn
      genEdType
      sections {
        classes {
          dayOfWeek
        }
      }
    }
  }
`
