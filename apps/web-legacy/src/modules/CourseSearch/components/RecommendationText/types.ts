import { Semester, StudyProgram } from '@cgr/codegen'

export interface SelectedCourse {
  courseNo: string
  semesterKey: {
    semester: Semester
    studyProgram: StudyProgram
    academicYear: string
  }
}
