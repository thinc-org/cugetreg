import { MenuItemClassKey, StyleRules, Theme } from '@material-ui/core'

export function overrideMuiMenuItem(theme: Theme): Partial<StyleRules<MenuItemClassKey, {}>> {
  const defaultStyle: Partial<StyleRules<MenuItemClassKey, {}>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
