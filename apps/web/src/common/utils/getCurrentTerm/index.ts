import { termOptions } from '@web/common/constants/terms'
import { Term } from '@web/common/types/term'

const { academicYear, semester } = termOptions[1]

export function getCurrentTerm(): Term {
  // TODO: dynamic year and semester
  // Must sync with SearchCourse's SSR
  return {
    academicYear,
    semester,
  }
}
