import { StudyProgram } from '@thinc-org/chula-courses'

export interface Term {
  academicYear: string
  semester: string
}

export interface CourseGroup extends Term {
  studyProgram: StudyProgram
}

export interface CourseGroupResult extends CourseGroup {
  setStudyProgram: (newStudyProgram: StudyProgram) => void
  setYear: (newYear: string) => void
  setSemester: (newSemester: string) => void
}
