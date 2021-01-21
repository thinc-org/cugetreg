import { createMuiTheme, ThemeOptions } from '@material-ui/core'
import { deepAssign } from '@/utils/deepAssign'

const baseOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1890ff',
    },
  },
}

const lightOptions: ThemeOptions = deepAssign(baseOptions, {
  palette: {
    type: 'light',
  },
})

export const lightTheme = createMuiTheme(lightOptions)

const darkOptions: ThemeOptions = deepAssign(baseOptions, {
  palette: {
    type: 'dark',
    primary: {
      main: '#90caf9',
    },
  },
})

export const darkTheme = createMuiTheme(darkOptions)
