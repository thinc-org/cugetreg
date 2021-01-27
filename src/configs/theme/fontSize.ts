import { Theme, TypographyVariant } from '@material-ui/core'
import { TypographyStyleOptions } from '@material-ui/core/styles/createTypography'

const baseFontOptions: Record<TypographyVariant, TypographyStyleOptions> = {
  h1: {
    letterSpacing: 0,
    lineHeight: 'auto',
    fontSize: 60,
    fontWeight: 700,
  },
  h2: {
    letterSpacing: 0,
    lineHeight: 'auto',
    fontSize: 48,
    fontWeight: 700,
  },
  h3: {
    letterSpacing: 0,
    lineHeight: 56,
    fontSize: 30,
    fontWeight: 700,
  },
  h4: {
    letterSpacing: 0,
    lineHeight: 36,
    fontSize: 24,
    fontWeight: 700,
  },
  h5: {
    letterSpacing: 0.18,
    lineHeight: 24,
    fontSize: 20,
    fontWeight: 700,
  },
  h6: {
    letterSpacing: 0.15,
    lineHeight: 24,
    fontSize: 18,
    fontWeight: 400,
  },
  subtitle1: {
    letterSpacing: 0.18,
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 400,
  },
  subtitle2: {
    letterSpacing: 0.1,
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 400,
  },
  body1: {
    letterSpacing: 0.16,
    lineHeight: 24,
    fontFamily: 'ChulaCharasNew',
    fontSize: 16,
    fontWeight: 400,
  },
  body2: {
    letterSpacing: 0.25,
    lineHeight: 20,
    fontFamily: 'ChulaCharasNew',
    fontSize: 14,
    fontWeight: 400,
  },
  button: {
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'uppercase',
  },
  caption: {
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 10,
    fontWeight: 400,
  },
  overline: {
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 8,
    fontWeight: 400,
    textTransform: 'uppercase',
  },
}

const mobileFontOptions: Record<TypographyVariant, TypographyStyleOptions> = {
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  subtitle1: {},
  subtitle2: {},
  body1: {},
  body2: {},
  button: {},
  caption: {},
  overline: {},
}

const responsiveFontSizes = (defaultTheme: Theme): Theme => {
  const { breakpoints, typography } = defaultTheme
  const { pxToRem } = typography

  Object.keys(baseFontOptions).forEach((key: string) => {
    const variant = key as TypographyVariant
    const { ...baseStyle } = baseFontOptions[variant]
    const { ...mobileStyle } = mobileFontOptions[variant]
    if (typeof baseStyle.fontSize === 'number') {
      baseStyle.fontSize = pxToRem(baseStyle.fontSize)
    }
    if (typeof mobileStyle.fontSize === 'number') {
      mobileStyle.fontSize = pxToRem(mobileStyle.fontSize)
    }

    Object.assign(typography[variant], {
      ...baseStyle,
      [breakpoints.down('md')]: mobileStyle,
    })
  })

  return defaultTheme
}

export default responsiveFontSizes
