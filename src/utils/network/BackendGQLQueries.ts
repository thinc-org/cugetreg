import { Course, StudyProgram } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'

interface CourseGroup {
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

const COURSE_DATE_QUERY = `
{
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
}`

export const GET_COURSE = gql`
query GetCourseInfo($courseNo: String!, $courseGroup: CourseGroupInput!) {
    course(courseNo: $courseNo, courseGroup: $courseGroup)
    ${COURSE_DATE_QUERY}
}
`
export default undefined
