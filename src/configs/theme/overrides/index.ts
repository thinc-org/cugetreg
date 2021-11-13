import { Theme } from '@mui/material'
import { Components } from '@mui/material/styles'

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
    MuiLink: {
      defaultProps: { underline: 'hover' },
    },
  }

  defaultTheme.components = overrides
  return defaultTheme
}
