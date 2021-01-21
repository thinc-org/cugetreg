import { createMuiTheme } from '@material-ui/core'
import responsiveFontSizes from './fontSize'
import palette from './palette'

const defaultTheme = createMuiTheme({
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
  palette,
})

export default responsiveFontSizes(defaultTheme)
