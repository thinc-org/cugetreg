import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from '@material-ui/core'
import styled from '@emotion/styled'
import { Schedule } from '@/components/Schedule'
import { useTimetableClasses } from '@/components/Schedule/utils'
import { ScheduleTable } from '@/components/ScheduleTable'
import { observer } from 'mobx-react'
import { courseCartStore } from '@/store'

const PageContainer = styled.div`
  padding-top: 32px;
`

const Title = styled(Typography)`
  margin-bottom: 28px;
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

function SchedulePage() {
  const { t } = useTranslation('schedulePage')
  const shopItems = courseCartStore.shopItems
  const classes = useTimetableClasses(shopItems)
  const credits = shopItems.reduce((credits, item) => credits + item.credit, 0)

  return (
    <PageContainer>
      <Title variant="h2">{t('title')}</Title>
      <Schedule classes={classes} />
      <InfoBar>
        <div style={{ display: 'flex' }}>
          <Typography variant="subtitle1" style={{ marginRight: 16 }}>
            {t('sumCreditsDesc')}
          </Typography>
          <Typography variant="h6">{t('sumCredits', { credits })}</Typography>
        </div>
        <InfoSpacer />
        <ButtonBar>
          {/* <Button variant="outlined">{t('downloadPng')}</Button>
          <Button variant="outlined">{t('addToCalendar')}</Button> */}
          <Button variant="outlined">{t('showJorTor11')}</Button>
        </ButtonBar>
      </InfoBar>
      <ScheduleTable courseCart={courseCartStore} />
    </PageContainer>
  )
}

export default observer(SchedulePage)
