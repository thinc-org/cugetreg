import { Typography, TypographyProps, TypographyVariant, useTheme } from '@mui/material'
import { CSSProperties } from 'react'

type ScheduleTypographyProps = TypographyProps & {
  variant: TypographyVariant
}

export function ScheduleTypography({ variant, ...props }: ScheduleTypographyProps) {
  const theme = useTheme()
  const { fontSize, lineHeight } = theme.typography[variant]
  const style: CSSProperties = {}
  let fontSizeRem: number | undefined
  if (typeof fontSize === 'string') {
    const match = fontSize.match(/(.*)rem/)
    if (match) {
      fontSizeRem = parseFloat(match[1])
      style.fontSize = `${fontSizeRem}em`
    }
  }
  if (typeof lineHeight === 'string') {
    const match = (lineHeight as string).match(/(.*)rem/)
    if (match && typeof fontSizeRem !== 'undefined') {
      const lineHeightRem = parseFloat(match[1])
      style.lineHeight = `${lineHeightRem / fontSizeRem}em`
    }
  }
  return <Typography variant={variant} {...props} style={style} />
}
