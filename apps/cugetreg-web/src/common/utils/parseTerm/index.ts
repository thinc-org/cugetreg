import { Term } from '@web/common/types/term'

import { getCurrentTerm } from '../getCurrentTerm'

const termPattern = /^(\d\d\d\d)\/(\d)$/

export function parseTerm(term: string): Term {
  const match = term.match(termPattern)
  if (!match) return getCurrentTerm()
  const [academicYear, semester] = term.split('/')
  return { academicYear, semester }
}
