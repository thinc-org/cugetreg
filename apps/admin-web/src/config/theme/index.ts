import { ThemeOptions, createTheme } from '@mui/material'

import { deepAssign } from '@admin-web/common/deepAssign'

import { lightPaletteOptions } from './palette'

const themeBaseOptions: ThemeOptions = {
  typography: {
    // htmlFontSize: (16 * 16) / 18,
    fontFamily: "'JetBrains Mono','IBM Plex Sans Thai', monospace",
    h1: {
      fontWeight: 700,
      fontSize: 32,
    },
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
})

export const defaultTheme = createTheme(themeBaseOptions)
export const lightTheme = createTheme(lightThemeOptions)
