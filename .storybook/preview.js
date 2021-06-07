import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { lightTheme } from '../src/configs/theme'

import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

const themeDecorator = (Story) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  </LocalizationProvider>
)

export const decorators = [themeDecorator]
