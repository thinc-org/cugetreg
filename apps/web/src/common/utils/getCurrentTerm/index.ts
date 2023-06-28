import { tempHardCodedCurrentTerm } from '@web/common/constants/terms'
import { Term } from '@web/common/types/term'

export function getCurrentTerm(): Term {
  // TODO: dynamic year and semester
  // Must sync with SearchCourse's SSR
  return tempHardCodedCurrentTerm
}
