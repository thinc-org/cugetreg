import { PropsWithChildren } from 'react'

import { Typography as MuiTypography, styled } from '@mui/material'

const Typography = styled(MuiTypography)`
  min-width: 80;
`

export const Caption = ({ children }: PropsWithChildren) => (
  <Typography variant="caption" color="primaryRange.100">
    {children}
  </Typography>
)
