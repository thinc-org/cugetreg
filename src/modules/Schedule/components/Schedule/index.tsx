import { styled } from '@material-ui/system'
import { withContentRect } from 'react-measure'

import { ClassCard } from './components/ClassCard'
import { Gutters } from './components/Gutters'
import { Header } from './components/Header'
import { DimensionsProvider, getHeightRatio, useDimensions } from './dimensions'
import { ScheduleClass } from './utils'

const ScheduleTable = styled('div')(({ theme }) => ({
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
        <ClassCard key={`${scheduleClass.courseNo}-${scheduleClass.classIndex}`} scheduleClass={scheduleClass} />
      ))}
    </ScheduleTable>
  )
}

const ScheduleContainer = styled('div')`
  position: relative;

  > div {
    position: absolute;
    top: 0;
  }
`

export interface AutoScaleScheduleProps extends ScheduleProps {
  daysCount: number
  hourEnd: number
}

const AutoScaleSchedule = withContentRect('bounds')<AutoScaleScheduleProps>(
  ({ measureRef, contentRect, daysCount, hourEnd, ...props }) => (
    <>
      <div ref={measureRef} style={{ width: '100%' }} />
      <ScheduleContainer style={{ paddingTop: `${getHeightRatio(daysCount, hourEnd) * 100}%` }}>
        {contentRect.bounds?.width ? (
          <DimensionsProvider width={contentRect.bounds.width} daysCount={daysCount} hourEnd={hourEnd}>
            <Schedule {...props} />
          </DimensionsProvider>
        ) : null}
      </ScheduleContainer>
    </>
  )
)

export { AutoScaleSchedule as Schedule }
