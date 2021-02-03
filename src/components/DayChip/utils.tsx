import { Theme } from '@material-ui/core'
import { DayOfWeek } from '@thinc-org/chula-courses'

export const dayColorMapper = (theme: Theme, dayOfWeek: DayOfWeek) => {
  const textColor = {
    MO: theme.palette.secondaryRange[900],
    TU: theme.palette.highlight.pink[700],
    WE: theme.palette.highlight.green[700],
    TH: theme.palette.highlight.orange[700],
    FR: theme.palette.highlight.blue[700],
    SA: theme.palette.highlight.purple[700],
    SU: theme.palette.highlight.red[700],
  }[dayOfWeek]

  const backgroundColor = {
    MO: theme.palette.secondaryRange[100],
    TU: theme.palette.highlight.pink[300],
    WE: theme.palette.highlight.green[300],
    TH: theme.palette.highlight.orange[300],
    FR: theme.palette.highlight.blue[300],
    SA: theme.palette.highlight.purple[300],
    SU: theme.palette.highlight.red[300],
  }[dayOfWeek]

  return { textColor, backgroundColor }
}
