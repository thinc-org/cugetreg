import { deepAssign } from '@/utils/deepAssign'
import { lightPaletteOptions, darkPaletteOptions } from './palette'
import { createMuiTheme, ThemeOptions } from '@material-ui/core'
import responsiveFontSizes from './fontSize'
import overrides from './overrides'

const themeBaseOptions: ThemeOptions = {
  typography: {
    htmlFontSize: 16,
    fontFamily: ['Prompt', 'Poppins', 'sans-serif'].join(' '),
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
  overrides: overrides,
}

const lightThemeOptions: ThemeOptions = deepAssign(themeBaseOptions, {
  palette: lightPaletteOptions,
})

const darkThemeOptions: ThemeOptions = deepAssign(themeBaseOptions, {
  palette: darkPaletteOptions,
})

export const lightTheme = responsiveFontSizes(createMuiTheme(lightThemeOptions))

export const darkTheme = responsiveFontSizes(createMuiTheme(darkThemeOptions))
