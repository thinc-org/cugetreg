import { Theme } from '@material-ui/core'
import { Components } from '@material-ui/core/styles/components'
import { overrideMuiChipStyles } from './chip'
import { overrideMuiInputBase } from './inputBase'
import { overrideMuiInputLabel } from './inputLabel'
import { overrideMuiMenuItem } from './menuItem'
import { overrideMuiOutlinedInput } from './outlinedInput'

const overrideMuiBaseComponent = (defaultTheme: Theme): Theme => {
  const overrides: Components = {
    // override here
    MuiChip: {
      styleOverrides: overrideMuiChipStyles(defaultTheme),
    },
    MuiInputBase: {
      styleOverrides: overrideMuiInputBase(defaultTheme),
    },
    MuiInputLabel: {
      styleOverrides: overrideMuiInputLabel(defaultTheme),
    },
    MuiOutlinedInput: {
      styleOverrides: overrideMuiOutlinedInput(defaultTheme),
    },
    MuiMenuItem: {
      styleOverrides: overrideMuiMenuItem(defaultTheme),
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
