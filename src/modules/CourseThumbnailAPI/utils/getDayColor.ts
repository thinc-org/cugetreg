import { Theme } from '@emotion/react'
import { DayOfWeek } from '@thinc-org/chula-courses'

export function getDayColor(theme: Theme, day: DayOfWeek): string {
  switch (day) {
    case 'MO':
      return theme.palette.secondaryRange[600]
    case 'TU':
      return theme.palette.highlight.pink[500]
    case 'WE':
      return theme.palette.highlight.green[500]
    case 'TH':
      return theme.palette.highlight.orange[500]
    case 'FR':
      return theme.palette.highlight.blue[500]
    case 'SA':
      return theme.palette.highlight.purple[500]
    case 'SU':
      return theme.palette.highlight.red[500]
    default:
      return 'white'
  }
}
