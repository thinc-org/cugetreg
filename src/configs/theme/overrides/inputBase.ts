import { InputBaseClassKey, Theme } from '@material-ui/core'
import { OverridesStyleRules } from '@material-ui/core/styles/overrides'

export function overrideMuiInputBase(theme: Theme): Partial<OverridesStyleRules<InputBaseClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<InputBaseClassKey>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
