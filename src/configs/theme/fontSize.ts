import { Theme, TypographyVariant } from '@material-ui/core'
import { TypographyOptions, TypographyStyleOptions } from '@material-ui/core/styles/createTypography'

const desktopFontSizeOptions: TypographyOptions = {
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

const mobileFontSizeOptions: TypographyOptions = {
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
  const {
    breakpoints,
    typography: { pxToRem },
  } = defaultTheme

  const MuiTypography: TypographyOptions = Object.entries(desktopFontSizeOptions).reduce((prev, curr) => {
    const [varaint, desktopOptions] = curr as [TypographyVariant, TypographyStyleOptions?]
    const mobileOptions = mobileFontSizeOptions[varaint]
    const desktopFontSize = desktopOptions?.fontSize ? desktopOptions?.fontSize : undefined
    const mobileFontSize = mobileOptions?.fontSize ? mobileOptions?.fontSize : undefined
    return {
      ...prev,
      [varaint]: {
        ...desktopOptions,
        fontSize: typeof desktopFontSize === 'number' ? pxToRem(desktopFontSize) : desktopFontSize,
        [breakpoints.down('md')]: {
          // we need to wait for breakpoints.
          ...mobileOptions,
          fontSize: typeof mobileFontSize === 'number' ? pxToRem(mobileFontSize) : mobileFontSize,
        },
      },
    }
  }, {})

  const responsiveTheme: Theme = {
    ...defaultTheme,
    overrides: {
      MuiTypography,
    },
  }

  return responsiveTheme
}

export default responsiveFontSizes
