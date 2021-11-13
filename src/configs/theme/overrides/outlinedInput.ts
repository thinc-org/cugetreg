import { OutlinedInputClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

export function overrideMuiOutlinedInput(theme: Theme): Partial<OverridesStyleRules<OutlinedInputClassKey>> {
  const borderColor = theme.palette.primaryRange[100]
  const defaultStyle: Partial<OverridesStyleRules<OutlinedInputClassKey>> = {
    root: {
      borderRadius: theme.spacing(0.5),
      '&:hover $notchedOutline': {
        borderColor: theme.palette.primaryRange[300],
      },
      '@media (hover: none)': {
        '&:hover $notchedOutline': {
          borderColor: borderColor,
        },
      },
      '&$focused $notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
      '&$error $notchedOutline': {
        borderColor: theme.palette.error.main,
      },
      '&$disabled $notchedOutline': {
        borderColor: theme.palette.action.disabled,
      },
    },
  }
  return defaultStyle
}
