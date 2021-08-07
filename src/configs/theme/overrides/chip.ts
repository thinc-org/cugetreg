import { ChipClassKey, StyleRules, Theme, SimplePaletteColorOptions } from '@material-ui/core'

import { Highlight } from '../palette'

export function overrideMuiChipStyles(theme: Theme): Partial<StyleRules<ChipClassKey, {}>> {
  const defaultStyle: Partial<StyleRules<ChipClassKey, {}>> = {
    label: {
      ...theme.typography.overline,
      lineHeight: 'normal',
    },
    sizeSmall: {
      height: theme.spacing(2),
    },
    sizeMedium: {
      height: theme.spacing(2.5),
    },
    avatar: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      fontSize: theme.typography.pxToRem(6),
    },
    deleteIcon: {
      fontSize: theme.spacing(1.5),
    },
    icon: {
      fontSize: theme.spacing(1.5),
    },
  }
  return defaultStyle
}

export type ChipFilledHighlightColor =
  | 'pinkFilled'
  | 'redFilled'
  | 'orangeFilled'
  | 'greenFilled'
  | 'blueFilled'
  | 'purpleFilled'
  | 'yellowFilled'
  | 'deepGrayFilled'

export type ChipFilledHighlight = Record<ChipFilledHighlightColor, SimplePaletteColorOptions>

export const makeChipFilledHighlight = (highlight: Highlight) =>
  Object.fromEntries(
    Object.entries(highlight).map(([color, { 300: light, 700: dark }]) => [
      `${color}Filled`,
      { main: light, dark: light, contrastText: dark },
    ])
  ) as ChipFilledHighlight

export type ChipOutlinedHighlight = Record<ChipOutlinedHighlightColor, SimplePaletteColorOptions>

export type ChipOutlinedHighlightColor =
  | 'pinkOutlined'
  | 'redOutlined'
  | 'orangeOutlined'
  | 'greenOutlined'
  | 'blueOutlined'
  | 'purpleOutlined'
  | 'yellowOutlined'
  | 'deepGrayOutlined'

export const makeChipOutlinedHighlight = (highlight: Highlight) =>
  Object.fromEntries(
    Object.entries(highlight).map(([color, { 300: light, 700: dark }]) => [
      `${color}Outlined`,
      { main: dark, dark: light, contrastText: light },
    ])
  ) as ChipOutlinedHighlight

declare module '@material-ui/core/Chip' {
  interface ChipPropsColorOverrides
    extends Record<ChipFilledHighlightColor, true>,
      Record<ChipOutlinedHighlightColor, true> {}
}
