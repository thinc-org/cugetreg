import { RatingClassKey, Theme } from '@mui/material'
import { OverridesStyleRules } from '@mui/material/styles/overrides'

export function overrideMuiRating(theme: Theme): Partial<OverridesStyleRules<RatingClassKey>> {
  const defaultStyle: Partial<OverridesStyleRules<RatingClassKey>> = {
    iconEmpty: {
      color: theme.palette.primaryRange[50],
    },
  }
  return defaultStyle
}
