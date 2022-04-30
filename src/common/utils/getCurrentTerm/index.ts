import { Term } from '@/common/types/term'

export function getCurrentTerm() {
  // TODO: dynamic year and semester
  // Must sync with SearchCourse's SSR
  const currentTerm: Term = {
    academicYear: '2564',
    semester: '3',
  }
  return currentTerm
}
