import { StudyProgram } from '@thinc-org/chula-courses'
import { ParsedUrlQuery } from 'querystring'

import { DEFAULT_STUDY_PROGRAM } from '../../constants'
import { CourseGroup } from '../../types'
import { parseTerm } from '../parseTerm'

export function parseCourseGroup(query: ParsedUrlQuery): CourseGroup {
  const studyProgram = (query.studyProgram ?? DEFAULT_STUDY_PROGRAM) as StudyProgram
  const term = parseTerm((query.term ?? '') as string)
  return {
    studyProgram,
    ...term,
  }
}
