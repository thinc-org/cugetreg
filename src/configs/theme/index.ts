import { deepAssign } from '@/utils/deepAssign'
import { lightPaletteOptions, darkPaletteOptions } from './palette'
import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core'
import overrideMuiTypography from './typography'
import overrideMuiBaseComponent from './overrides'
import shadows from './shadows'

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
  shadows: shadows,
}

const lightThemeOptions: ThemeOptions = deepAssign(themeBaseOptions, {
  palette: lightPaletteOptions,
})

const darkThemeOptions: ThemeOptions = deepAssign(themeBaseOptions, {
  palette: darkPaletteOptions,
})

const buildTheme = (themeOptions: ThemeOptions): Theme => {
  const theme = createMuiTheme(themeOptions)
  overrideMuiTypography(theme)
  overrideMuiBaseComponent(theme)
  return theme
}

export const lightTheme = buildTheme(lightThemeOptions)
export const darkTheme = buildTheme(darkThemeOptions)
