import { StudyProgram } from '@thinc-org/chula-courses'
import { ParsedUrlQuery } from 'querystring'

const defaultStudyProgram = 'S'

export interface Term {
  academicYear: string
  semester: string
}

export interface CourseGroup extends Term {
  studyProgram: StudyProgram
}

const termPattern = /(\d\d\d\d)-(\d)/

// TODO: dynamic year and semester
// Must sync with SearchCourse's SSR
export const currentTerm: Term = {
  academicYear: '2564',
  semester: '1',
}

export function parseTerm(term: string): Term {
  const match = term.match(termPattern)
  if (!match) {
    return currentTerm
  }
  console.log(match)
  return currentTerm
}

export function parseCourseGroup(query: ParsedUrlQuery): CourseGroup {
  const studyProgram = (query.studyProgram ?? defaultStudyProgram) as StudyProgram
  const term = parseTerm((query.term ?? '') as string)
  return {
    studyProgram,
    ...term,
  }
}
