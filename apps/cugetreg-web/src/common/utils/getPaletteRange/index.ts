import { Theme } from '@mui/material'

import { GenEdType } from '@cugetreg/codegen'

import { HighlightColorRange } from '@web/configs/theme/palette'

export function getPaletteRange(theme: Theme, genEdType: GenEdType): HighlightColorRange {
  switch (genEdType) {
    case 'HU':
      return theme.palette.highlight.pink
    case 'IN':
      return theme.palette.highlight.purple
    case 'SO':
      return theme.palette.highlight.green
    // GENED SC
    default: {
      const secondary = theme.palette.secondaryRange
      return {
        300: secondary[100],
        500: secondary[500],
        700: secondary[900],
      }
    }
  }
}
