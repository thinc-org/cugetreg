import { Term } from '../../types'

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
