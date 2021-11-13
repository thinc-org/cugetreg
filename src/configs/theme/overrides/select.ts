import { InputLabelClassKey, Theme } from '@material-ui/core'
import { OverridesStyleRules } from '@material-ui/core/styles/overrides'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function overrideMuiSelect(theme: Theme): Partial<OverridesStyleRules<InputLabelClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<InputLabelClassKey>> = {
    root: {
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
