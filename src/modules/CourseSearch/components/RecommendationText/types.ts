import { Semester, StudyProgram } from '@thinc-org/chula-courses'

export interface SelectedCourse {
  courseNo: string
  semesterKey: {
    semester: Semester
    studyProgram: StudyProgram
    academicYear: string
  }
}
