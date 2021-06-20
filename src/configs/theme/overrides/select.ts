import { InputLabelClassKey, StyleRules, Theme } from '@material-ui/core'

export function overrideMuiSelect(theme: Theme): Partial<StyleRules<InputLabelClassKey, {}>> {
  const defaultStyle: Partial<StyleRules<InputLabelClassKey, {}>> = {
    root: {
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
