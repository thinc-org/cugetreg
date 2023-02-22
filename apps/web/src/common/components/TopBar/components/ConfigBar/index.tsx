import { useTranslation } from 'react-i18next'

import { Typography } from '@mui/material'
import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { REPORT_PROBLEM, STUDY_PROGRAM_DROPDOWN } from '@web/common/context/Analytics/constants'
import { Spacer } from '@web/components/Spacer'
import { sessionIdStore } from '@web/store/sessionIdStore'
import { observer } from 'mobx-react'

import { StudyProgramDropdown } from '../StudyProgramDropdown'
import { TermDropdown } from '../TermDropdown'
import { FlexContainer } from '../styled'
import { ConfigBarItem, ConfigBarItemLink, ConfigBarLayout } from './styled'

export const ConfigBar = observer(() => {
  const { t } = useTranslation('configBar')

  const sessionId = sessionIdStore.sessionId
  const reportProblemLink = `https://airtable.com/shruwAAfn1763TgMU?prefill_Session_ID=${sessionId}`

  return (
    <ConfigBarLayout>
      <FlexContainer>
        <Spacer />
        <Analytics elementName={STUDY_PROGRAM_DROPDOWN}>
          {({ log }) => <StudyProgramDropdown log={log} />}
        </Analytics>
        <ConfigBarItem>
          <TermDropdown />
        </ConfigBarItem>
        <Analytics elementName={REPORT_PROBLEM}>
          <ConfigBarItemLink href={reportProblemLink} target="_blank" rel="noreferrer">
            <Typography variant="subtitle2">{t('reportAProblem')}</Typography>
          </ConfigBarItemLink>
        </Analytics>
      </FlexContainer>
    </ConfigBarLayout>
  )
})
