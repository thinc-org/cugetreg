import { Typography, TypographyVariant, WithTheme, withTheme } from '@material-ui/core'
import { Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Typography',
  component: Typography,
} as Meta

const variants: TypographyVariant[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'button',
  'caption',
  'overline',
]

const TypographyPreview = withTheme(({ variant, theme }: { variant: TypographyVariant } & WithTheme) => {
  const style = theme.typography[variant]
  const firstFont = style.fontFamily?.split(',')[0]
  let fontSize = style.fontSize
  if (typeof fontSize === 'string') {
    const match = fontSize.match(/(\d*(.\d*)?)rem/)
    if (match) {
      const rem = parseFloat(match[1])
      // for some reasons, htmlFontSize is missing from the type definition
      const px = rem * (theme.typography as any).htmlFontSize
      fontSize = `${px}px`
    }
  }
  return (
    <div>
      <Typography key={variant} variant={variant}>
        {variant} / {firstFont} / {style.fontWeight} / {fontSize}
      </Typography>
    </div>
  )
})

export const TypographyStyles = () => {
  return (
    <>
      {variants.map((variant) => (
        <TypographyPreview key={variant} variant={variant} />
      ))}
    </>
  )
}
