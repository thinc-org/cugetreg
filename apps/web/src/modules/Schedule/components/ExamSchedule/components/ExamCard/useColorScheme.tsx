import { useTheme } from '@mui/material'

import { getPaletteRange } from '@web/common/utils/getPaletteRange'

import { GenEdType } from '@cgr/codegen'

interface ColorScheme {
  background: string
  border: string
  text: string
}

export function useColorScheme(genEdType: GenEdType, hasOverlap: boolean): ColorScheme {
  const theme = useTheme()
  if (hasOverlap) {
    return {
      background: theme.palette.highlight.red[700],
      border: theme.palette.highlight.red[500],
      text: theme.palette.common.white,
    }
  }
  if (genEdType === 'NO') {
    return {
      background: theme.palette.background.default,
      border: theme.palette.primaryRange[50],
      text: theme.palette.primaryRange[500],
    }
  }
  const range = getPaletteRange(theme, genEdType)
  return {
    background: theme.palette.background.default,
    border: range[700],
    text: theme.palette.primaryRange[500],
  }
}
