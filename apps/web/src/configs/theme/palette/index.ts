import { PaletteOptions } from '@mui/material/styles'

import { ChipFilledHighlight, ChipOutlinedHighlight } from '../overrides/chip'
import { paletteDarkBaseOptions } from './dark'
import { paletteLightBaseOptions } from './light'

export type PaletteRange = 10 | 30 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type HighlightColor =
  | 'pink'
  | 'red'
  | 'orange'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'yellow'
  | 'indigo'
  | 'deepGray'

export type PaletteRangeOptions = Record<PaletteRange, string>

export type HighlightColorRange = Pick<PaletteRangeOptions, 300 | 500 | 700>

export type Highlight = Record<HighlightColor, HighlightColorRange>

declare module '@mui/material/styles' {
  interface Palette extends ChipFilledHighlight, ChipOutlinedHighlight {
    white: string
    primaryRange: PaletteRangeOptions
    secondaryRange: Omit<PaletteRangeOptions, 10 | 30>
    highlight: Highlight
  }
  interface PaletteOptions extends ChipFilledHighlight, ChipOutlinedHighlight {
    white: string
    primaryRange: PaletteRangeOptions
    secondaryRange: Omit<PaletteRangeOptions, 10 | 30>
    highlight: Highlight
  }
}

export const lightPaletteOptions: PaletteOptions = {
  ...paletteLightBaseOptions,
  mode: 'light',
}

export const darkPaletteOptions: PaletteOptions = {
  ...paletteDarkBaseOptions,
  mode: 'dark',
}
