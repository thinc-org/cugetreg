import { Semester, StudyProgram } from '@libs/codegen'

export interface SelectedCourse {
  courseNo: string
  semesterKey: {
    semester: Semester
    studyProgram: StudyProgram
    academicYear: string
  }
}
