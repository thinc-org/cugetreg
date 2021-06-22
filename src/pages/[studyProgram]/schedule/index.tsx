import React, { useState, createRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from '@material-ui/core'
import styled from '@emotion/styled'
import { Schedule } from '@/components/Schedule'
import { useScheduleClass, useTimetableClasses } from '@/components/Schedule/utils'
import { ScheduleTable } from '@/components/ScheduleTable'
import { observer } from 'mobx-react'
import { Theme } from '@emotion/react'
import { courseCartStore } from '@/store'
import { ExamSchedule } from '@/components/ExamSchedule'
import SaveImgButton from '@/components/SaveImgButton'

const PageContainer = styled.div`
  padding-top: 32px;
`

const Title = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`

interface ScheduleContainerProps {
  enabled: boolean
}

const ScheduleContainer = styled.div`
  ${({ enabled }: ScheduleContainerProps) => !enabled && `display: none`};
`

const InfoBar = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 36px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: initial;
  }
`

const ButtonBar = styled.div`
  display: flex;
  align-items: center;

  button + button {
    margin-left: 16px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 16px;
  }
`

const InfoSpacer = styled.div`
  flex: 1;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`

const TabContainer = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    justify-content: center;

    > button {
      width: 50%;
    }
  }
`

type TabButtonProps = {
  current: number
  theme?: Theme
}

const TabButton = styled(Button)`
  width: 150px;
  ${({ current, theme }: TabButtonProps) => current && `background-color: ${theme?.palette.primaryRange[10]}`};
`

const ExamContainer = styled.div<{ enabled: boolean }>`
  display: ${({ enabled }) => (!enabled ? 'none' : 'block')};
`

function SchedulePage() {
  const { t } = useTranslation('schedulePage')
  const shopItems = courseCartStore.shopItems
  const classes = useTimetableClasses(shopItems)
  const scheduleClasses = useScheduleClass(classes)
  const [isExamTable, setExamTable] = useState(false)
  const credits = shopItems.reduce((credits, item) => credits + item.credit, 0)
  const ref = createRef<HTMLDivElement>()

  return (
    <PageContainer>
      <TitleContainer>
        <Title variant="h2">{t('title')}</Title>
        <TabContainer>
          <TabButton
            current={isExamTable ? 1 : 0}
            onClick={() => setExamTable(false)}
            variant={!isExamTable ? 'contained' : undefined}
            color={!isExamTable ? 'primary' : undefined}
          >
            {t('classSchedule')}
          </TabButton>
          <TabButton
            current={!isExamTable ? 1 : 0}
            onClick={() => setExamTable(true)}
            variant={isExamTable ? 'contained' : undefined}
            color={isExamTable ? 'primary' : undefined}
          >
            {t('examSchedule')}
          </TabButton>
        </TabContainer>
      </TitleContainer>
      <ScheduleContainer enabled={!isExamTable} ref={ref}>
        <Schedule classes={scheduleClasses} />
      </ScheduleContainer>
      <ExamContainer enabled={isExamTable}>
        <ExamSchedule classes={shopItems} />
      </ExamContainer>
      <InfoBar>
        <div style={{ display: 'flex' }}>
          <Typography variant="subtitle1" style={{ marginRight: 16 }}>
            {t('sumCreditsDesc')}
          </Typography>
          <Typography variant="h6">{t('sumCredits', { credits })}</Typography>
        </div>
        <InfoSpacer />
        <ButtonBar>
          <SaveImgButton imageRef={ref} />
          <Button variant="outlined">{t('addToCalendar')}</Button>
          <Button variant="outlined">{t('showJorTor11')}</Button>
        </ButtonBar>
      </InfoBar>
      <ScheduleTable courseCart={courseCartStore} />
    </PageContainer>
  )
}

export default observer(SchedulePage)
