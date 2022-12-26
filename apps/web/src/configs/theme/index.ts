import { Theme, ThemeOptions, createTheme } from '@mui/material'

import { deepAssign } from '@web/common/utils/deepAssign'

import { overrideMuiBaseComponent } from './overrides'
import { darkPaletteOptions, lightPaletteOptions } from './palette'
import { darkShadows, lightShadows } from './shadows'
import { overrideMuiTypography } from './typography'

const themeBaseOptions: ThemeOptions = {
  typography: {
    htmlFontSize: (16 * 16) / 18,
    fontFamily: ['Poppins', 'Prompt', 'sans-serif'].join(','),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
}

const lightThemeOptions: ThemeOptions = deepAssign(themeBaseOptions, {
  palette: lightPaletteOptions,
  shadows: lightShadows,
})

const darkThemeOptions: ThemeOptions = deepAssign(themeBaseOptions, {
  palette: darkPaletteOptions,
  shadows: darkShadows,
})

const buildTheme = (themeOptions: ThemeOptions): Theme => {
  const theme = createTheme(themeOptions)
  overrideMuiTypography(theme)
  overrideMuiBaseComponent(theme)
  return theme
}

export const lightTheme = buildTheme(lightThemeOptions)
export const darkTheme = buildTheme(darkThemeOptions)
