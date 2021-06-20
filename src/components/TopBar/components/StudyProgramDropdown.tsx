import { useStudyProgram } from '@/utils/hooks/useStudyProgram'
import { StudyProgram } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'
import { ConfigBarSelect } from './ConfigBarSelect'

export default function StudyProgramDropdown() {
  const { t } = useTranslation('studyProgram')
  const { studyProgram, setStudyProgram } = useStudyProgram()
  return (
    <ConfigBarSelect value={studyProgram} onChange={(e) => setStudyProgram(e.target.value as StudyProgram)}>
      <option value="S">{t('S')}</option>
      <option value="T">{t('T')}</option>
      <option value="I">{t('I')}</option>
    </ConfigBarSelect>
  )
}
