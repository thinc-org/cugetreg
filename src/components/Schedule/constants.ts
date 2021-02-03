import { HighlightColorRange } from '@/configs/theme/palette'
import { Theme, useTheme } from '@material-ui/core'
import { DayOfWeek, GenEdType } from '@thinc-org/chula-courses'

export const hourStart = 8
export const hourEnd = 19

export const days: DayOfWeek[] = ['MO', 'TU', 'WE', 'TH', 'FR']

export const colsCount = hourEnd - hourStart + 2
export const rowsCount = days.length + 1

export const strokeSize = 1

interface ColorScheme {
  background: string
  border: string
  text: string
}

function getPaletteRange(theme: Theme, genEdType: GenEdType): HighlightColorRange {
  switch (genEdType) {
    case 'HU':
      return theme.palette.highlight.pink
    case 'IN':
      return theme.palette.highlight.purple
    case 'SO':
      return theme.palette.highlight.green
  }
  // gened sc
  const secondary = theme.palette.secondaryRange
  return {
    300: secondary[100],
    500: secondary[500],
    700: secondary[900],
  }
}

export function useColorScheme(genEdType?: GenEdType): ColorScheme {
  const theme = useTheme()
  if (typeof genEdType === 'undefined') {
    return {
      background: theme.palette.primaryRange[10],
      border: theme.palette.primaryRange[50],
      text: theme.palette.primaryRange[500],
    }
  } else {
    const range = getPaletteRange(theme, genEdType)
    return {
      background: range[300],
      border: range[700],
      text: range[700],
    }
  }
}
