import { OutlinedInputClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

export function overrideMuiOutlinedInput(
  theme: Theme
): Partial<OverridesStyleRules<OutlinedInputClassKey>> {
  const borderColor = theme.palette.divider
  const defaultStyle: Partial<OverridesStyleRules<OutlinedInputClassKey>> = {
    notchedOutline: {
      borderColor: borderColor,
      transition: theme.transitions.create('border-color', {
        duration: theme.transitions.duration.shorter,
      }),
    },
  }
  return defaultStyle
}
