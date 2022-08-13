import { InputBaseClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

export function overrideMuiInputBase(
  theme: Theme
): Partial<OverridesStyleRules<InputBaseClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<InputBaseClassKey>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
