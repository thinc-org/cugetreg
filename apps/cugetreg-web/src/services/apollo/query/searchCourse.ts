import { Course, DayOfWeek, GenEdType, Period } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

import { CourseGroup } from '@web/common/hooks/useCourseGroup/types'

import { COURSE_DATA_FIELDS } from './courseDataField'

export interface SearchCourseVars {
  filter: {
    keyword?: string
    genEdTypes?: GenEdType[]
    dayOfWeeks?: DayOfWeek[]
    limit?: number
    offset?: number
    periodRange?: Period
  }
  courseGroup: CourseGroup
}

export interface SearchCourseResponse {
  search: Course[]
}

export const SEARCH_COURSE = gql`
query Search($filter: FilterInput!, $courseGroup: CourseGroupInput!) {
    search(filter: $filter, courseGroup: $courseGroup) {
        ${COURSE_DATA_FIELDS}
    }
}
`
