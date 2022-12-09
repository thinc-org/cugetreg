import React from 'react'

import { Typography, TypographyProps } from '@mui/material'

export const withTypography = (Component: React.FC<{ children: React.ReactNode }>) => {
  const ComponentWithTypography = (props: TypographyProps) => (
    <Component>
      <Typography {...props} />
    </Component>
  )
  return ComponentWithTypography
}
