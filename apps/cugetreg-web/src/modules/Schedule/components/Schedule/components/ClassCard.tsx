import { DayOfWeek } from '@cugetreg/codegen'

import { styled } from '@mui/material'

import { useColor } from '@web/modules/Schedule/components/ColorPicker/hooks/useColor'

import { useDimensions } from '../dimensions'
import { ScheduleClass } from '../utils'
import { ScheduleTypography } from './ScheduleTypography'

interface ClassCardProps {
  scheduleClass: ScheduleClass
  onClick: () => void
}

export const ClassCardLayout = styled('div')({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '0.25em',
  padding: '0.5em',
  textAlign: 'center',
  ':hover': {
    filter: 'brightness(94%)',
    cursor: 'pointer',
  },
  ':active': {
    filter: 'brightness(85%)',
  },
})

const ClassCardTypography = styled(ScheduleTypography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export function ClassCard({ scheduleClass, onClick }: ClassCardProps) {
  const { cellHeight, getPosition } = useDimensions()
  const { courseNo, abbrName, position, dayOfWeek, building, room, sectionNo, hasOverlap, color } =
    scheduleClass

  // color
  const colorScheme = useColor(color, hasOverlap ?? false)

  // position
  const startPosition = position.start
  const endPosition = position.end
  const y = getY(dayOfWeek || DayOfWeek.Ia)
  const { top, left } = getPosition(y, startPosition)
  const right = getPosition(y, endPosition).left
  const width = right - left
  const isWide = endPosition - startPosition >= 2

  const buildingAndRoom = `${building || ''} ${room || ''}`.trim()

  return (
    <ClassCardLayout
      sx={{
        top,
        left,
        width,
        height: cellHeight,
        backgroundColor: colorScheme.background,
        border: `1px solid ${colorScheme.border}`,
        color: colorScheme.text,
      }}
      onClick={onClick}
    >
      <ClassCardTypography variant="subtitle2">
        {isWide && courseNo} {abbrName}
      </ClassCardTypography>
      <ClassCardTypography variant="caption">
        {buildingAndRoom && `${buildingAndRoom} | `}Sec {sectionNo}
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
