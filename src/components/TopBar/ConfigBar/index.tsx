import { FlexOne } from '@/components/FlexOne'
import { FlexContainer } from '../FlexContainer'
import { ConfigBarItem } from './ConfigBarItem'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'

import StudyProgramDropdown from '../components/StudyProgramDropdown'
import { sessionId } from '@/utils/network/logging'
import { observer } from 'mobx-react'
import { sessionIdStore } from '@/store/sessionIdStore'

import { Analytics } from '@/context/analytics/components/Analytics'
import { REPORT_PROBLEM, STUDY_PROGRAM_DROPDOWN } from '@/context/analytics/components/const'

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
          {({ log }) => (
            <ConfigBarItemLink onClick={log} href={reportProblemLink} target="_blank" rel="noreferrer">
              {t('reportAProblem')}
            </ConfigBarItemLink>
          )}
        </Analytics>
      </FlexContainer>
    </ConfigBarLayout>
  )
})
