import { OutlinedInputClassKey, StyleRules, Theme } from '@material-ui/core'

export function overrideMuiOutlinedInput(theme: Theme): Partial<StyleRules<OutlinedInputClassKey, {}>> {
  const borderColor = theme.palette.primaryRange[100]
  const defaultStyle: Partial<StyleRules<OutlinedInputClassKey, {}>> = {
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
