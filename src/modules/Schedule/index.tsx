import { Button, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { observer } from 'mobx-react'
import React, { useState, createRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@/common/context/Analytics/components/LinkWithAnalytics'
import { CR11_BUTTON, CLASS_TAB_BUTTON, EXAM_TAB_BUTTON } from '@/common/context/Analytics/constants'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { courseCartStore } from '@/store'

import { ExamSchedule } from './components/ExamSchedule'
import { useExamClasses } from './components/ExamSchedule/utils'
import { SaveImgButton } from './components/SaveImgButton'
import { Schedule } from './components/Schedule'
import { useDaysCount, useOverlappingCourses, useScheduleClass, useTimetableClasses } from './components/Schedule/utils'
import { ScheduleTable } from './components/ScheduleTable'
import {
  InfoBar,
  ButtonBar,
  InfoSpacer,
  PageContainer,
  TabButton,
  TabContainer,
  Title,
  TitleContainer,
  ScheduleContainer,
  ExamContainer,
} from './styled'

export const SchedulePage = observer(() => {
  const { t } = useTranslation('schedulePage')
  const courseGroup = useCourseGroup()
  const shopItems = courseCartStore.shopItemsByCourseGroup(courseGroup)
  const classes = useTimetableClasses(shopItems)
  const scheduleClasses = useScheduleClass(classes)
  const daysCount = useDaysCount(scheduleClasses)
  const { midtermClasses, finalClasses } = useExamClasses(shopItems)
  const overlappingCourses = useOverlappingCourses(scheduleClasses, midtermClasses, finalClasses)

  const [isExamTable, setExamTable] = useState(false)
  const credits = shopItems.filter((course) => !course.isHidden).reduce((credits, item) => credits + item.credit, 0)
  const ref = createRef<HTMLDivElement>()

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const { studyProgram } = useCourseGroup()

  return (
    <PageContainer>
      <TitleContainer>
        <Title variant="h2">{t('title')}</Title>
        <TabContainer>
          <Analytics elementName={CLASS_TAB_BUTTON}>
            <TabButton
              current={isExamTable ? 1 : 0}
              onClick={() => {
                setExamTable(false)
              }}
              variant={!isExamTable ? 'contained' : undefined}
              color={!isExamTable ? 'primary' : undefined}
            >
              {t('classSchedule')}
            </TabButton>
          </Analytics>
          <Analytics elementName={EXAM_TAB_BUTTON}>
            <TabButton
              current={!isExamTable ? 1 : 0}
              onClick={() => {
                setExamTable(true)
              }}
              variant={isExamTable ? 'contained' : undefined}
              color={isExamTable ? 'primary' : undefined}
            >
              {t('examSchedule')}
            </TabButton>
          </Analytics>
        </TabContainer>
      </TitleContainer>
      <ScheduleContainer enabled={!isExamTable}>
        <div ref={ref}>
          <Schedule classes={scheduleClasses} daysCount={daysCount} />
        </div>
      </ScheduleContainer>
      <ExamContainer enabled={isExamTable}>
        <ExamSchedule midtermClasses={midtermClasses} finalClasses={finalClasses} />
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
          {!isExamTable && <SaveImgButton imageRef={ref} />}
          <Button variant="outlined" disabled>
            {t('addToCalendar')}
          </Button>
          <LinkWithAnalytics href={`/${studyProgram}/schedule/cr11`} passHref elementName={CR11_BUTTON}>
            <Button style={{ marginRight: 0 }} variant="outlined">
              {isDesktop ? t('showCR11') : t('showCR11Mobile')}
            </Button>
          </LinkWithAnalytics>
        </ButtonBar>
      </InfoBar>
      <ScheduleTable courseCart={courseCartStore} overlappingCourses={overlappingCourses} />
    </PageContainer>
  )
})
