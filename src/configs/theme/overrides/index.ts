import { Theme } from '@material-ui/core'
import { Components } from '@material-ui/core/styles/components'

import { overrideMuiChipStyles } from './chip'
import { overrideMuiInputBase } from './inputBase'
import { overrideMuiInputLabel } from './inputLabel'
import { overrideMuiMenuItem } from './menuItem'
import { overrideMuiSelect } from './select'

export const overrideMuiBaseComponent = (defaultTheme: Theme): Theme => {
  const overrides: Components = {
    // override here
    MuiChip: {
      styleOverrides: overrideMuiChipStyles(defaultTheme),
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiInputBase: {
      defaultProps: { size: 'small' },
      styleOverrides: overrideMuiInputBase(defaultTheme),
    },
    MuiInputLabel: {
      styleOverrides: overrideMuiInputLabel(defaultTheme),
    },
    // MuiOutlinedInput: {
    //   styleOverrides: overrideMuiOutlinedInput(defaultTheme),
    // },
    MuiMenuItem: {
      styleOverrides: overrideMuiMenuItem(defaultTheme),
    },
    MuiSelect: {
      styleOverrides: overrideMuiSelect(defaultTheme),
    },
  }

  defaultTheme.components = overrides
  return defaultTheme
}