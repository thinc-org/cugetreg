import { styled } from '@mui/material'

import { withContentRect } from 'react-measure'

import { courseCartStore } from '@/store'

import { CourseDialog } from '../CourseDialog'
import { useCourseDialogDisclosure } from '../CourseDialog/hooks/useCourseDialogDisclosure'
import { ClassCard } from './components/ClassCard'
import { Gutters } from './components/Gutters'
import { Header } from './components/Header'
import { DimensionsProvider, getHeightRatio, useDimensions } from './dimensions'
import { ScheduleClass, CourseOverlapMap } from './utils'

const ScheduleTable = styled('div')(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.paper,
  fontSize: 16,
}))

export interface ScheduleProps {
  classes: ScheduleClass[]
  overlappingCourses: CourseOverlapMap
}

function Schedule({ classes, overlappingCourses }: ScheduleProps) {
  const { width, height, cellWidth } = useDimensions()
  const fontSize = (16 * cellWidth) / 77
  const { open, onClose, onOpen, onRemove, selectedClasssetDialog } = useCourseDialogDisclosure()
  return (
    <ScheduleTable style={{ width, height, fontSize }}>
      <Header />
      <Gutters />
      {selectedClasssetDialog && (
        <CourseDialog
          item={courseCartStore.item(selectedClasssetDialog.item)!}
          open={open}
          onClose={onClose}
          onRemove={onRemove}
          overlaps={overlappingCourses[selectedClasssetDialog.courseNo]}
        />
      )}
      {classes.map((scheduleClass) => (
        <ClassCard
          key={`${scheduleClass.courseNo}-${scheduleClass.classIndex}`}
          scheduleClass={scheduleClass}
          onClick={() => onOpen(scheduleClass)}
        />
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
