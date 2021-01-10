import { createMuiTheme, ThemeOptions } from '@material-ui/core'

const lightOptions: ThemeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#1890ff',
    },
  },
}

export const lightTheme = createMuiTheme(lightOptions)
