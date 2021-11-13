import { InputLabelClassKey, Theme } from '@material-ui/core'
import { OverridesStyleRules } from '@material-ui/core/styles/overrides'

export function overrideMuiInputLabel(theme: Theme): Partial<OverridesStyleRules<InputLabelClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<InputLabelClassKey>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
