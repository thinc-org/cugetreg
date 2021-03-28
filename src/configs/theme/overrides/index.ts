import { Theme } from '@material-ui/core'
import { Overrides } from '@material-ui/core/styles/overrides'
import { overrideMuiChipStyles } from './chip'
import { overrideMuiOutlinedInput } from './outlinedInput'

const overrideMuiBaseComponent = (defaultTheme: Theme): Theme => {
  const overrides: Overrides = {
    // override here
    MuiChip: overrideMuiChipStyles(defaultTheme),
    MuiOutlinedInput: overrideMuiOutlinedInput(defaultTheme),
  }

  defaultTheme.overrides = overrides
  return defaultTheme
}

export default overrideMuiBaseComponent
