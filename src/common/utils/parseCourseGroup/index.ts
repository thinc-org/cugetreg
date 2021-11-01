import { StudyProgram, StudyProgramEnum } from '@thinc-org/chula-courses'
import { ParsedUrlQuery } from 'querystring'

import { parseTerm } from '@/common/utils/parseTerm'

import { DEFAULT_STUDY_PROGRAM } from '../../hooks/useCourseGroup/constants'
import { CourseGroup } from '../../hooks/useCourseGroup/types'

export function parseCourseGroup(
  query: ParsedUrlQuery,
  defaultStudyProgram: StudyProgram = DEFAULT_STUDY_PROGRAM
): CourseGroup {
  const studyProgram = Object.values(StudyProgramEnum).includes(query.studyProgram as StudyProgramEnum)
    ? (query.studyProgram as StudyProgramEnum)
    : defaultStudyProgram
  const term = parseTerm((query.term ?? '') as string)
  return {
    studyProgram,
    ...term,
  }
}
