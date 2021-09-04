import { Typography, TypographyVariant } from '@material-ui/core'
import React from 'react'

interface PropTypes {
  variant: TypographyVariant
  children: React.ReactNode
}

export const withTypography = (Component: React.FC) => {
  const ComponentWithTypoGraphy = (props: PropTypes) => (
    <Component>
      <Typography variant={props.variant}>{props.children}</Typography>
    </Component>
  )
  return ComponentWithTypoGraphy
}
