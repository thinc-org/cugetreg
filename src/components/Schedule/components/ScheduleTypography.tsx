import { Typography, TypographyProps, TypographyVariant, useTheme } from '@material-ui/core'
import { CSSProperties } from 'react'

type ScheduleTypographyProps = TypographyProps & {
  variant: TypographyVariant
}

export function ScheduleTypography({ variant, ...props }: ScheduleTypographyProps) {
  const theme = useTheme()
  const { fontSize, lineHeight } = theme.typography[variant]
  const style: CSSProperties = {}
  if (typeof fontSize === 'string') {
    const match = fontSize.match(/(.*)rem/)
    if (match) {
      style.fontSize = `${match[1]}em`
    }
  }
  if (typeof lineHeight === 'string') {
    const match = lineHeight.match(/(.*)rem/)
    if (match) {
      style.lineHeight = `${match[1]}em`
    }
  }
  return <Typography variant={variant} {...props} style={style} />
}
