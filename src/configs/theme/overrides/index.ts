import { Theme } from '@material-ui/core'
import { Overrides } from '@material-ui/core/styles/overrides'
import overrideChipStyles from './chip'

const overrideMuiBaseComponent = (defaultTheme: Theme): Theme => {
  const overrides: Overrides = {
    // override here
    MuiChip: overrideChipStyles(defaultTheme),
  }

  defaultTheme.overrides = overrides
  return defaultTheme
}

export default overrideMuiBaseComponent
