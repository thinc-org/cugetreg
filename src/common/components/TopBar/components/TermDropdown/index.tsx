import { ChangeEvent } from 'react'

import { useCourseGroup } from '@/common/hooks/useCourseGroup'

import { ConfigBarSelect } from '../ConfigSelect'

interface TermDropdownProps {
  log?: (_: unknown, value: string) => void
}

// TODO: clearify the changing term flow
export function TermDropdown({ log }: TermDropdownProps) {
  const { academicYear, semester, setTerm } = useCourseGroup()

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value as string
    setTerm(term)
    log?.(null, term)
  }

  return (
    <ConfigBarSelect value={`${academicYear}/${semester}`} onChange={handleChange}>
      <option value="2564/2">2564/2</option>
      <option value="2564/1">2564/1</option>
    </ConfigBarSelect>
  )
}
