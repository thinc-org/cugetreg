import { Typography } from '@material-ui/core'
import { PropsWithChildren } from 'react'

export const Caption = ({ children }: PropsWithChildren<{}>) => (
  <Typography variant="caption" color="primaryRange.100">
    {children}
  </Typography>
)
