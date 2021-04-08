import { Theme } from '@material-ui/core'
import { Components } from '@material-ui/core/styles/components'
import { overrideMuiChipStyles } from './chip'
import { overrideMuiOutlinedInput } from './outlinedInput'

const overrideMuiBaseComponent = (defaultTheme: Theme): Theme => {
  const overrides: Components = {
    // override here
    MuiChip: {
      styleOverrides: overrideMuiChipStyles(defaultTheme),
    },
    MuiOutlinedInput: {
      styleOverrides: overrideMuiOutlinedInput(defaultTheme),
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
  }

  defaultTheme.components = overrides
  return defaultTheme
}

export default overrideMuiBaseComponent
