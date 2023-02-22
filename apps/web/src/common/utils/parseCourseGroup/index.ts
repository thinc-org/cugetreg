import { parseTerm } from '@web/common/utils/parseTerm'
import { ParsedUrlQuery } from 'querystring'

import { StudyProgram } from '@cgr/codegen'

import { DEFAULT_STUDY_PROGRAM } from '../../hooks/useCourseGroup/constants'
import { CourseGroup } from '../../hooks/useCourseGroup/types'

export function parseCourseGroup(
  query: ParsedUrlQuery,
  defaultStudyProgram: StudyProgram = DEFAULT_STUDY_PROGRAM
): CourseGroup {
  const studyProgram = Object.values(StudyProgram).includes(query.studyProgram as StudyProgram)
    ? (query.studyProgram as StudyProgram)
    : defaultStudyProgram
  const term = parseTerm((query.term ?? '') as string)
  return {
    studyProgram,
    ...term,
  }
}
