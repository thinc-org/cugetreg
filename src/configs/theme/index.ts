import { deepAssign } from '@/utils/deepAssign'
import { createMuiTheme, ThemeOptions } from '@material-ui/core'
import responsiveFontSizes from './fontSize'
import { lightPaletteOptions, darkPaletteOptions } from './palette'

const themeBaseOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Prompt, Poppins, sans-serif',
  },
  breakpoints: {
    values: {
      // same as mui default breakpoints values, we need to change this later
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

export const lightTheme = responsiveFontSizes(createMuiTheme(lightThemeOptions))

export const darkTheme = responsiveFontSizes(createMuiTheme(darkThemeOptions))
