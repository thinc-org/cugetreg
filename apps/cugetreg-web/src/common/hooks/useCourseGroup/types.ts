import { Term } from '@web/common/types/term'

import { StudyProgram } from '@libs/codegen'

export interface CourseGroup extends Term {
  studyProgram: StudyProgram
}

export interface CourseGroupResult extends CourseGroup {
  setStudyProgram: (newStudyProgram: StudyProgram) => void
  setTerm: (term: string) => void
}
