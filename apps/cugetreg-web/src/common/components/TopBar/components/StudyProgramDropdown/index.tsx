import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { StudyProgram } from '@thinc-org/chula-courses'

import { useCourseGroup } from '@web/common/hooks/useCourseGroup'

import { ConfigBarSelect } from '../ConfigSelect'

interface StudyProgramDropdownProps {
  log: (_: unknown, value: string) => void
}

export function StudyProgramDropdown({ log }: StudyProgramDropdownProps) {
  const { t } = useTranslation('studyProgram')
  const { studyProgram, setStudyProgram } = useCourseGroup()

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const program = e.target.value as StudyProgram
    log(null, program)
    setStudyProgram(program)
  }

  return (
    <ConfigBarSelect value={studyProgram} onChange={handleChange}>
      <option value="S">{t('S')}</option>
      <option value="T">{t('T')}</option>
      <option value="I">{t('I')}</option>
    </ConfigBarSelect>
  )
}
