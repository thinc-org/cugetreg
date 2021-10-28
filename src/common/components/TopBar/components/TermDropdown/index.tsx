import { ChangeEvent } from 'react'

import { TERM_DROPDOWN } from '@/common/context/Analytics/constants'
import { useLog } from '@/common/context/Analytics/hooks/useLog'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'

import { ConfigBarSelect } from '../ConfigSelect'

// TODO: clearify the changing term flow
export function TermDropdown() {
  const { academicYear, semester, setTerm } = useCourseGroup()
  const { log } = useLog(TERM_DROPDOWN)

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value as string
    setTerm(term)
    log(null, term)
  }

  return (
    <ConfigBarSelect value={`${academicYear}/${semester}`} onChange={handleChange}>
      <option value="2564/2">2564/2</option>
      <option value="2564/1">2564/1</option>
    </ConfigBarSelect>
  )
}
