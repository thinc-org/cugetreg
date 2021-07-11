import styled from '@emotion/styled'
import { ExamList } from './components/ExamList'
import { Typography, IconButton } from '@material-ui/core'
import CachedIcon from '@material-ui/icons/Cached'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExamClass } from './components/ExamCard'

interface ExamScheduleProps {
  midtermClasses: ExamClass[]
  finalClasses: ExamClass[]
}

const ExamScheduleContainer = styled.div`
  display: flex;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    > div:first-of-type {
      margin-right: ${({ theme }) => theme.spacing(4)};
    }
  }
`

const ExamListContainer = styled.div<{ show: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    /* display: none; */
    ${({ show }) => !show && `display: none;`}
  }
`

const ExamTitleContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  display: flex;
  align-items: center;
`

const IconButtonRefresh = styled(IconButton)`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: none;
  }
`

export function ExamSchedule({ midtermClasses, finalClasses }: ExamScheduleProps) {
  const [isMidternMobile, setMidtermMobile] = useState(true)
  const { t } = useTranslation('examSchedule')

  return (
    <>
      <ExamScheduleContainer>
        <ExamListContainer show={isMidternMobile}>
          <ExamTitleContainer>
            <Typography variant="h4">{t('midterm')}</Typography>
            <IconButtonRefresh
              color="primary"
              aria-label="switch midterm final"
              onClick={() => setMidtermMobile(!isMidternMobile)}
            >
              <CachedIcon />
            </IconButtonRefresh>
          </ExamTitleContainer>
          <ExamList isFinal={false} classes={midtermClasses} />
        </ExamListContainer>
        <ExamListContainer show={!isMidternMobile}>
          <ExamTitleContainer>
            <Typography variant="h4">{t('final')}</Typography>
            <IconButtonRefresh
              color="primary"
              aria-label="switch midterm final"
              onClick={() => setMidtermMobile(!isMidternMobile)}
            >
              <CachedIcon />
            </IconButtonRefresh>
          </ExamTitleContainer>
          <ExamList isFinal={true} classes={finalClasses} />
        </ExamListContainer>
      </ExamScheduleContainer>
    </>
  )
}
