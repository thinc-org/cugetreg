import { InputBaseClassKey, StyleRules, Theme } from '@material-ui/core'

export function overrideMuiInputBase(theme: Theme): Partial<StyleRules<InputBaseClassKey, {}>> {
  const defaultStyle: Partial<StyleRules<InputBaseClassKey, {}>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
