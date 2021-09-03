import { StudyProgram } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'

import { useCourseGroup } from '@/common/hooks/useCourseGroup'

import { ConfigBarSelect } from './ConfigBarSelect'

interface StudyProgramDropdownProps {
  log: (_: unknown, value: string) => void
}

export function StudyProgramDropdown({ log }: StudyProgramDropdownProps) {
  const { t } = useTranslation('studyProgram')
  const { studyProgram, setStudyProgram } = useCourseGroup()
  return (
    <ConfigBarSelect
      value={studyProgram}
      onChange={(e) => {
        const program = e.target.value as StudyProgram
        log(null, program)
        setStudyProgram(program)
      }}
    >
      <option value="S">{t('S')}</option>
      <option value="T">{t('T')}</option>
      <option value="I">{t('I')}</option>
    </ConfigBarSelect>
  )
}
