import { InputLabelClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

export function overrideMuiInputLabel(
  theme: Theme
): Partial<OverridesStyleRules<InputLabelClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<InputLabelClassKey>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
