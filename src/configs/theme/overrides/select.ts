import { SelectClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

export function overrideMuiSelect(theme: Theme): Partial<OverridesStyleRules<SelectClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<SelectClassKey>> = {
    root: {
      lineHeight: 'normal',
    },
    icon: {
      color: theme.palette.primaryRange[100],
    },
  }
  return defaultStyle
}
