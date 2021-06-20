import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@material-ui/core'
import { lightTheme } from '../src/configs/theme'

import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

const themeDecorator = (Story) => (
  <StyledEngineProvider injectFirst>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    </LocalizationProvider>
  </StyledEngineProvider>
)

export const decorators = [themeDecorator]
