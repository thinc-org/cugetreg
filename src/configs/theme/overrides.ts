import { Theme } from '@material-ui/core'
import { Overrides } from '@material-ui/core/styles/overrides'

const overrideTheme = (defaultTheme: Theme): Theme => {
  const overrides: Overrides = {
    // override here
  }

  Object.assign(defaultTheme, { overrides })
  return defaultTheme
}

export default overrideTheme
