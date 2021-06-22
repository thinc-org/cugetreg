import { withContentRect } from 'react-measure'
import { Header } from './components/Header'
import { DimensionsProvider, heightRatio, useDimensions } from './dimensions'
import { Gutters } from './components/Gutters'
import { ScheduleClass } from './utils'
import { ClassCard } from './components/ClassCard'
import { styledWithTheme } from '@/utils/styledWithTheme'
import styled from '@emotion/styled'

const ScheduleTable = styledWithTheme('div')((theme) => ({
  position: 'relative',
  background: theme.palette.background.paper,
  fontSize: 16,
}))

export interface ScheduleProps {
  classes: ScheduleClass[]
}

function Schedule({ classes }: ScheduleProps) {
  const { width, height, cellWidth } = useDimensions()
  const fontSize = (16 * cellWidth) / 77
  return (
    <ScheduleTable style={{ width, height, fontSize }}>
      <Header />
      <Gutters />
      {classes.map((scheduleClass) => (
        <ClassCard
          key={`${scheduleClass.courseNo}_${scheduleClass.dayOfWeek}_${scheduleClass.position.start}`}
          scheduleClass={scheduleClass}
        />
      ))}
    </ScheduleTable>
  )
}

const ScheduleContainer = styled.div`
  position: relative;
  padding-top: ${heightRatio * 100}%;

  > div {
    position: absolute;
    top: 0;
  }
`

const AutoScaleSchedule = withContentRect('bounds')<ScheduleProps>(({ measureRef, contentRect, ...props }) => (
  <>
    <div ref={measureRef} style={{ width: '100%' }} />
    <ScheduleContainer>
      {contentRect.bounds?.width ? (
        <DimensionsProvider width={contentRect.bounds.width}>
          <Schedule {...props} />
        </DimensionsProvider>
      ) : null}
    </ScheduleContainer>
  </>
))

export { AutoScaleSchedule as Schedule }
