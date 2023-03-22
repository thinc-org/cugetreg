import { deepAssign } from '@admin-web/common/deepAssign'
import { ThemeOptions, createTheme } from '@mui/material'
import { lightPaletteOptions } from './palette'

const themeBaseOptions: ThemeOptions = {
  typography: {
    htmlFontSize: (16 * 16) / 18,
    fontFamily: "'JetBrains Mono', monospace",
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
