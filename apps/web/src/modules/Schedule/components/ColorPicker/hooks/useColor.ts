import { useTheme } from '@mui/material'
import { ScheduleColor } from '@web/modules/Schedule/components/ColorPicker/constants'

export interface ColorScheme {
  background: string
  border: string
  text: string
}

export function useColor(
  scheduleColor: ScheduleColor | undefined,
  hasOverlap = false
): ColorScheme {
  const theme = useTheme()
  if (hasOverlap) {
    return {
      background: theme.palette.highlight.red[700],
      border: theme.palette.highlight.red[500],
      text: theme.palette.common.white,
    }
  }
  if (scheduleColor === 'secondary') {
    return {
      background: theme.palette.secondaryRange[100],
      border: theme.palette.secondaryRange[700],
      text: theme.palette.secondaryRange[900],
    }
  }
  if (!scheduleColor || scheduleColor === 'primary') {
    return {
      background: theme.palette.primaryRange[10],
      border: theme.palette.primaryRange[50],
      text: theme.palette.primaryRange[500],
    }
  }
  const range = theme.palette.highlight[scheduleColor]
  return {
    background: range[300],
    border: range[500],
    text: range[700],
  }
}
