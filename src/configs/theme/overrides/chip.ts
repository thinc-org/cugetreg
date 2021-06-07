import { ChipClassKey, emphasize, alpha, StyleRules, Theme, SimplePaletteColorOptions } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles'
import { HighlightColorRange, Highlight } from '../palette'
import { highlightStyleGenerator, highlightMapper } from './utils'

// This function is used for apply highlight CSS class name to Mui-Chip
const enchanceMuiChipStyles = (
  defaultStyle: Partial<StyleRules<ChipClassKey, {}>>,
  theme: Theme
): Partial<StyleRules<ChipClassKey, {}>> => {
  const rootStyleProperties = (highlight: HighlightColorRange): CSSProperties => ({
    color: highlight[700],
    backgroundColor: highlight[300],
    '& $avatar': {
      color: highlight[700],
      backgroundColor: theme.palette.white,
    },
    '& $icon': {
      color: highlight[700],
      '&:hover': {
        color: alpha(highlight[700], 0.7),
      },
    },
    '& $deleteIcon': {
      color: highlight[700],
      '&:hover': {
        color: alpha(highlight[700], 0.7),
      },
    },
  })
  const clickableStyleProperties = (highlight: HighlightColorRange): CSSProperties => ({
    '&:hover, &:focus': {
      backgroundColor: emphasize(highlight[300], 0.08),
    },
  })
  const deletableStyleProperties = (highlight: HighlightColorRange): CSSProperties => ({
    '&:focus': {
      backgroundColor: emphasize(highlight[300], 0.08),
    },
  })
  const outlinedStyleProperties = (highlight: HighlightColorRange): CSSProperties => ({
    color: highlight[700],
    backgroundColor: theme.palette.white,
    border: `1px solid ${highlight[700]}`,
    '$clickable&:hover, $clickable&:focus, $deletable&:focus': {
      backgroundColor: alpha(highlight[700], theme.palette.action.hoverOpacity),
    },
    '& $avatar': {
      color: theme.palette.white,
      backgroundColor: highlight[700],
    },
  })

  Object.assign(defaultStyle.root, highlightStyleGenerator(rootStyleProperties, theme))
  Object.assign(defaultStyle.clickable, highlightStyleGenerator(clickableStyleProperties, theme))
  Object.assign(defaultStyle.deletable, highlightStyleGenerator(deletableStyleProperties, theme))
  Object.assign(defaultStyle.outlined, highlightStyleGenerator(outlinedStyleProperties, theme))

  return defaultStyle
}

// This function is used for overriding Mui-Chip styles
export function overrideMuiOldChipStyles(theme: Theme): Partial<StyleRules<ChipClassKey, {}>> {
  // default Chip style using `deepGray` color.
  const highlight = highlightMapper('deepGray', theme)
  const defaultStyle: Partial<StyleRules<ChipClassKey, {}>> = {
    label: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    labelSmall: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
    },
    root: {
      color: theme.palette.highlight.deepGray[700],
      backgroundColor: theme.palette.highlight.deepGray[300],
      transition: theme.transitions.create(['color', 'background-color']),
      '& $avatar': {
        color: theme.palette.highlight.deepGray[700],
      },
      '& $deleteIcon': {
        transition: theme.transitions.create(['color']),
      },
      '& $clikable': {
        transition: theme.transitions.create(['background-color']),
      },
    },
    outlined: {
      backgroundColor: theme.palette.white,
      color: theme.palette.highlight.deepGray[700],
      border: `1px solid ${theme.palette.highlight.deepGray[700]}`,
      transition: theme.transitions.create(['color', 'background-color']),
      '$clickable&:hover, $clickable&:focus, $deletable&:focus': {
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
      },
    },
    clickable: {
      transition: theme.transitions.create(['background-color']),
      WebkitTapHighlightColor: highlight[300],
      '&:hover, &:focus': {
        backgroundColor: emphasize(highlight[300], 0.04),
      },
    },
    deletable: {
      '&:focus': {
        backgroundColor: emphasize(highlight[300], 0.04),
      },
    },
    icon: {},
  }
  return enchanceMuiChipStyles(defaultStyle, theme)
}

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

export type ChipOutlinedHighlight = Record<ChipFilledHighlightColor, SimplePaletteColorOptions>

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
