import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { lightTheme } from '../src/configs/theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

const themeDecorator = (Story) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  </MuiPickersUtilsProvider>
)

export const decorators = [themeDecorator]
