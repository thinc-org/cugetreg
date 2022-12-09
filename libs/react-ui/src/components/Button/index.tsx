import { forwardRef } from 'react'

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material'

export interface ButtonProps extends MuiButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  return (
    <MuiButton {...props} ref={ref}>
      {children}
    </MuiButton>
  )
})
