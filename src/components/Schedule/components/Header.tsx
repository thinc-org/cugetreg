import { styled } from '@material-ui/core'
import { DayOfWeek } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'
import { Cell } from './Cell'
import { hourEnd, hourStart } from '../constants'
import { useDimensions } from '../dimensions'
import { ScheduleTypography } from './ScheduleTypography'
import { dayOfWeekArray } from '@/constants/dayOfWeek'

const HourTypography = styled(ScheduleTypography)({
  textAlign: 'left',
})

function HourCell({ hour }: { hour: number }) {
  return (
    <Cell x={hour - hourStart + 1} y={0}>
      <HourTypography variant="subtitle2">{hour}</HourTypography>
    </Cell>
  )
}

export function Header() {
  const { t } = useTranslation('schedule')
  const { stubCellWidth } = useDimensions()
  const fontSize = (16 * stubCellWidth) / 77
  const hourCells = []
  for (let hour = hourStart + 1; hour <= hourEnd; hour++) {
    hourCells.push(<HourCell key={hour} hour={hour} />)
  }
  return (
    <>
      <div style={{ fontSize }}>
        <Cell x={0} y={0}>
          <ScheduleTypography variant="subtitle2">{t('dateTime')}</ScheduleTypography>
        </Cell>
        <Cell x={1} y={0} />
        {dayOfWeekArray.slice(0, 7).map((day, index) => (
          <Cell key={day} x={0} y={index + 1}>
            <ScheduleTypography variant="subtitle2">{t(`days.${day}` as `days.${DayOfWeek}`)}</ScheduleTypography>
          </Cell>
        ))}
      </div>
      {hourCells}
    </>
  )
}
