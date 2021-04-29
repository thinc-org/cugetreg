import { InputLabelClassKey, StyleRules, Theme } from '@material-ui/core'

export function overrideMuiInputLabel(theme: Theme): Partial<StyleRules<InputLabelClassKey, {}>> {
  const defaultStyle: Partial<StyleRules<InputLabelClassKey, {}>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
