import { InputLabelClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function overrideMuiSelect(theme: Theme): Partial<OverridesStyleRules<InputLabelClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<InputLabelClassKey>> = {
    root: {
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
