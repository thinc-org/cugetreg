import { lightPaletteOptions, PaletteRangeOptions } from '@/configs/theme/palette'
import { SimplePaletteColorOptions } from '@material-ui/core'

export const BOX_BORDER_RADIUS = '4px'
export const BACKGROUND_COLOR = '#FFFFFF'
export const IMAGE_SIZE = 196
export const CHIP_BG = (lightPaletteOptions?.primary as SimplePaletteColorOptions).light as string
export const CHIP_TEXT = (lightPaletteOptions?.secondary as SimplePaletteColorOptions).contrastText as string
export const GENED_CHIP_COLOR = (lightPaletteOptions?.secondaryRange as Omit<PaletteRangeOptions, 10 | 30>)[
  '900'
] as string
