import { ThemeOptions, createTheme } from '@mui/material'

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

export const defaultTheme = createTheme(themeBaseOptions)
