import { ChipClassKey, StyleRules, Theme } from '@material-ui/core'

export default function overrideChipStyles(theme: Theme): Partial<StyleRules<ChipClassKey, {}>> {
  return {
    label: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    labelSmall: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
    },
  }
}
