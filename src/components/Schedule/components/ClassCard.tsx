import { styled } from '@material-ui/core'
import { DayOfWeek } from '@thinc-org/chula-courses'
import { useMemo } from 'react'
import { hourStart, useColorScheme } from '../constants'
import { useDimensions } from '../dimensions'
import { ScheduleClass } from '../types'
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
  const { courseNo, abbrName, genEdType, period, dayOfWeek, teacher, building, room } = scheduleClass

  // color
  const colorScheme = useColorScheme(genEdType)

  // position
  const startPosition = useTimePosition(period.start)
  const endPosition = useTimePosition(period.end)
  const y = getY(dayOfWeek)
  const { top, left } = getPosition(y, startPosition)
  const right = getPosition(y, endPosition).left - 1
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
        {teacher} | {building} {room}
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
    default:
      throw new Error('Day must be Monday - Friday')
  }
}

function useTimePosition(time: string) {
  return useMemo(() => {
    const match = time.match(/(\d+):(\d+)/)
    if (!match) {
      throw new Error('Class time must be in format hh:mm')
    }
    const hour = parseInt(match[1]) - hourStart + 2
    const minute = parseInt(match[2])
    return hour + minute / 60
  }, [time])
}
