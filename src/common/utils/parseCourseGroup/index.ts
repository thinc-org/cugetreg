import { StudyProgram } from '@thinc-org/chula-courses'
import { ParsedUrlQuery } from 'querystring'

import { parseTerm } from '@/common/utils/parseTerm'

import { DEFAULT_STUDY_PROGRAM } from '../../hooks/useCourseGroup/constants'
import { CourseGroup } from '../../hooks/useCourseGroup/types'

export function parseCourseGroup(query: ParsedUrlQuery): CourseGroup {
  const studyProgram = (query.studyProgram ?? DEFAULT_STUDY_PROGRAM) as StudyProgram
  const term = parseTerm((query.term ?? '') as string)
  return {
    studyProgram,
    ...term,
  }
}
