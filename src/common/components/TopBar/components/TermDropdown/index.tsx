import { ChangeEvent } from 'react'

import { termOptions } from '@/common/constants/terms'
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
      {termOptions.map(({ academicYear, semester, label }) => (
        <option key={`${academicYear}/${semester}`} value={`${academicYear}/${semester}`}>
          {label}
        </option>
      ))}
    </ConfigBarSelect>
  )
}
