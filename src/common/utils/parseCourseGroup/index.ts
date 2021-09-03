import { StudyProgram } from '@thinc-org/chula-courses'
import { ParsedUrlQuery } from 'querystring'

import { DEFAULT_STUDY_PROGRAM } from '../../hooks/useCourseGroup/constants'
import { CourseGroup } from '../../hooks/useCourseGroup/types'
import { parseTerm } from '../../hooks/useCourseGroup/utils/parseTerm'

export function parseCourseGroup(query: ParsedUrlQuery): CourseGroup {
  const studyProgram = (query.studyProgram ?? DEFAULT_STUDY_PROGRAM) as StudyProgram
  const term = parseTerm((query.term ?? '') as string)
  return {
    studyProgram,
    ...term,
  }
}
