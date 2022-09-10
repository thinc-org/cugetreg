import { StudyProgram } from '@cugetreg/codegen'
import { Semester } from '@cugetreg/codegen/future'

export interface SelectedCourse {
  courseNo: string
  semesterKey: {
    semester: Semester
    studyProgram: StudyProgram
    academicYear: string
  }
}
