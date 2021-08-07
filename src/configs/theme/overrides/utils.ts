import { Theme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles'

import { HighlightColor, HighlightColorRange } from '../palette'

// This function is used for converting from `HighlightColor` to `palette.highlight`
export const highlightMapper = (color: HighlightColor, theme: Theme): HighlightColorRange => {
  return theme.palette.highlight[color]
}

// This function is used for creating adjacent CSS class to Mui-Chip-root like `.Mui-Chip-root.deepGray`
export const highlightStyleGenerator = (
  styleProperties: (highlight: HighlightColorRange) => CSSProperties,
  theme: Theme
): CSSProperties => {
  const highlightColorArray = Object.keys(theme.palette.highlight) as HighlightColor[]
  return highlightColorArray.reduce<CSSProperties>(
    (prev, curr) => ({
      ...prev,
      [`&.${curr}`]: styleProperties(highlightMapper(curr, theme)),
    }),
    {}
  )
}
