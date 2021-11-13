import { MenuItemClassKey, Theme } from '@material-ui/core'
import { OverridesStyleRules } from '@material-ui/core/styles/overrides'

export function overrideMuiMenuItem(theme: Theme): Partial<OverridesStyleRules<MenuItemClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<MenuItemClassKey>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
