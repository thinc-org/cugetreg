import { ButtonClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

export function overrideMuiButton(theme: Theme): Partial<OverridesStyleRules<ButtonClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<ButtonClassKey>> = {
    root: {
      transition: theme.transitions.create('background border-color', { duration: theme.transitions.duration.shorter }),
    },
  }
  return defaultStyle
}
