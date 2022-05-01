import { termOptions } from '@/common/constants/terms'
import { Term } from '@/common/types/term'

const { academicYear, semester } = termOptions[0]

export function getCurrentTerm(): Term {
  // TODO: dynamic year and semester
  // Must sync with SearchCourse's SSR
  return {
    academicYear,
    semester,
  }
}
