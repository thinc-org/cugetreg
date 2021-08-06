import styled from '@emotion/styled'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'

import { FlexOne } from '@/components/FlexOne'
import { Analytics } from '@/context/analytics/components/Analytics'
import { REPORT_PROBLEM, STUDY_PROGRAM_DROPDOWN } from '@/context/analytics/components/const'
import { sessionIdStore } from '@/store/sessionIdStore'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'

import { FlexContainer } from '../FlexContainer'
import StudyProgramDropdown from '../components/StudyProgramDropdown'
import { ConfigBarItem } from './ConfigBarItem'

export const ConfigBarLayout = styled.div`
  width: 100%;
  height: 40px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primaryRange[10]};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

const ConfigBarItemLink = ConfigBarItem.withComponent('a')

export const ConfigBar = observer(() => {
  const { t } = useTranslation('configBar')

  const { academicYear, semester } = useCourseGroup()

  const sessionId = sessionIdStore.sessionId
  const reportProblemLink = `https://airtable.com/shruwAAfn1763TgMU?prefill_Session_ID=${sessionId}`

  return (
    <ConfigBarLayout>
      <FlexContainer>
        <FlexOne />
        <Analytics elementName={STUDY_PROGRAM_DROPDOWN}>{({ log }) => <StudyProgramDropdown log={log} />}</Analytics>
        <ConfigBarItem>
          {academicYear}/{semester}
        </ConfigBarItem>
        <Analytics elementName={REPORT_PROBLEM}>
          <ConfigBarItemLink href={reportProblemLink} target="_blank" rel="noreferrer">
            {t('reportAProblem')}
          </ConfigBarItemLink>
        </Analytics>
      </FlexContainer>
    </ConfigBarLayout>
  )
})
