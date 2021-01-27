import { deepAssign } from '@/utils/deepAssign'
import { lightPaletteOptions, darkPaletteOptions } from './palette'
import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core'
import overrideMuiTypography from './typography'
import overrideMuiBaseComponent from './overrides'

const buildTheme = (themeOptions: ThemeOptions): Theme => {
  const theme = createMuiTheme(themeOptions)
  overrideMuiTypography(theme)
  overrideMuiBaseComponent(theme)
  return theme
}

const themeBaseOptions: ThemeOptions = {
  typography: {
    htmlFontSize: 16,
    fontFamily: ['Prompt', 'Poppins', 'sans-serif'].join(','),
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

const darkThemeOptions: ThemeOptions = deepAssign(themeBaseOptions, {
  palette: darkPaletteOptions,
})

export const lightTheme = buildTheme(lightThemeOptions)
export const darkTheme = buildTheme(darkThemeOptions)
