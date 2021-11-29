import { MenuItemClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

export function overrideMuiMenuItem(theme: Theme): Partial<OverridesStyleRules<MenuItemClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<MenuItemClassKey>> = {
    root: {
      ...theme.typography.subtitle1,
      lineHeight: 'normal',
    },
  }
  return defaultStyle
}
