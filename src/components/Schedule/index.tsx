import { withContentRect } from 'react-measure'
import { styled } from '@material-ui/core'
import { Header } from './components/Header'
import { DimensionsProvider, useDimensions } from './dimensions'
import { Gutters } from './components/Gutters'
import { TimetableClass, useScheduleClass } from './utils'
import { ClassCard } from './components/ClassCard'

const ScheduleTable = styled('div')(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.paper,
  fontSize: 16,
}))

interface ScheduleProps {
  classes: TimetableClass[]
}

function Schedule({ classes: originalClasses }: ScheduleProps) {
  const { width, height, cellWidth } = useDimensions()
  const fontSize = (16 * cellWidth) / 77
  const classes = useScheduleClass(originalClasses)
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

const AutoScaleSchedule = withContentRect('bounds')<ScheduleProps>(({ measureRef, contentRect, ...props }) => (
  <>
    <div ref={measureRef} style={{ width: '100%' }} />
    {/* <div ref={measureRef} style={{ width: 1001, transform: 'scale(0.343' }} /> */}
    {contentRect.bounds?.width ? (
      <DimensionsProvider width={contentRect.bounds.width}>
        <Schedule {...props} />
      </DimensionsProvider>
    ) : null}
  </>
))

export { AutoScaleSchedule as Schedule }
