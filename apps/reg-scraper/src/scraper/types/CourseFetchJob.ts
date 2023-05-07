import { Semester, StudyProgram } from '@cgr/schema'

export default interface CourseFetchJob {
  courses: string[]
  studyProgram: StudyProgram
  academicYear: string
  semester: Semester
  tryCount: number
}
