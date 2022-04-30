import { termOptions } from '@/common/constants/terms'
import { Term } from '@/common/types/term'

export function getCurrentTerm(): Term {
  // TODO: dynamic year and semester
  // Must sync with SearchCourse's SSR
  return termOptions[0]
}
