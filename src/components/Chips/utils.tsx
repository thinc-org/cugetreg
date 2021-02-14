import { HighlightColor, HighlightColorRange } from '@/configs/theme/palette'
import { Theme } from '@material-ui/core'

export const highlightMapper = (color: HighlightColor, theme: Theme): HighlightColorRange => {
  return theme.palette.highlight[color]
}
