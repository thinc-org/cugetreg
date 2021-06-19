import { Course, DayOfWeek, GenEdType, StudyProgram } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

export interface CourseGroup {
  semester: string
  academicYear: string
  studyProgram: StudyProgram
}

export interface GetCourseVars {
  courseNo: string
  courseGroup: CourseGroup
}

export interface GetCourseResponse {
  course: Course
}

const COURSE_DATA_FIELDS = `
    studyProgram
    semester
    academicYear
    courseNo
    abbrName
    courseNameTh
    courseNameEn
    faculty
    credit
    creditHours
    courseCondition
    genEdType
    rating
    sections {
        sectionNo
        closed
        capacity {
            current
            max
        }
        note
        classes {
            type
            dayOfWeek
            period {
                start
                end
            }
            building
            teachers
        }
    }
`

export const GET_COURSE = gql`
query GetCourseInfo($courseNo: String!, $courseGroup: CourseGroupInput!) {
    course(courseNo: $courseNo, courseGroup: $courseGroup) {
        ${COURSE_DATA_FIELDS}
    }
}
`

export const SEARCH_COURSE = gql`
query Search($filter: FilterInput!, $courseGroup: CourseGroupInput!) {
    search(filter: $filter, courseGroup: $courseGroup) {
        ${COURSE_DATA_FIELDS}
    }
}
`

export interface SearchCourseVars {
  filter: {
    keyword?: string
    genEdType?: GenEdType[]
    dayOfWeeks?: DayOfWeek
    limit?: number
    offset?: number
  }
  courseGroup: CourseGroup
}

export interface SearchCourseResponse {
  search: Course[]
}

export default undefined
