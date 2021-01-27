import { Theme } from '@material-ui/core'
import { Overrides } from '@material-ui/core/styles/overrides'

const overrideMuiBaseComponent = (defaultTheme: Theme): Theme => {
  const overrides: Overrides = {
    // override here
  }

  defaultTheme.overrides = overrides
  return defaultTheme
}

export default overrideMuiBaseComponent
