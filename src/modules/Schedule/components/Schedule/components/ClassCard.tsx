import { styled } from '@material-ui/core'
import { DayOfWeek } from '@thinc-org/chula-courses'

import { useDimensions } from '../dimensions'
import { ScheduleClass, useColorScheme } from '../utils'
import { ScheduleTypography } from './ScheduleTypography'

interface ClassCardProps {
  scheduleClass: ScheduleClass
}

const ClassCardLayout = styled('div')({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '0.25em',
  padding: '0.5em',
  textAlign: 'center',
})

const ClassCardTypography = styled(ScheduleTypography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export function ClassCard({ scheduleClass }: ClassCardProps) {
  const { cellHeight, getPosition } = useDimensions()
  const { courseNo, abbrName, genEdType, position, dayOfWeek, teachers, building, room, hasOverlap } = scheduleClass

  // color
  const colorScheme = useColorScheme(genEdType, hasOverlap ?? false)

  // position
  const startPosition = position.start
  const endPosition = position.end
  const y = getY(dayOfWeek || 'IA')
  const { top, left } = getPosition(y, startPosition)
  const right = getPosition(y, endPosition).left
  const width = right - left
  const isWide = endPosition - startPosition >= 2
  return (
    <ClassCardLayout
      style={{
        top,
        left,
        width,
        height: cellHeight,
        backgroundColor: colorScheme.background,
        border: `1px solid ${colorScheme.border}`,
        color: colorScheme.text,
      }}
    >
      <ClassCardTypography variant="subtitle2">
        {isWide && courseNo} {abbrName}
      </ClassCardTypography>
      <ClassCardTypography variant="caption">
        {teachers.join(', ')} | {building} {room}
      </ClassCardTypography>
    </ClassCardLayout>
  )
}

function getY(day: DayOfWeek) {
  switch (day) {
    case 'MO':
      return 1
    case 'TU':
      return 2
    case 'WE':
      return 3
    case 'TH':
      return 4
    case 'FR':
      return 5
    case 'SA':
      return 6
    case 'SU':
      return 7
    default:
      throw new Error('Day must be Monday - Friday')
  }
}
