import styled from '@emotion/styled'
import { Typography as MuiTypography } from '@material-ui/core'
import { PropsWithChildren } from 'react'

const Typography = styled(MuiTypography)`
  min-width: 80;
`

export const Caption = ({ children }: PropsWithChildren<{}>) => (
  <Typography variant="caption" color="primaryRange.100">
    {children}
  </Typography>
)
