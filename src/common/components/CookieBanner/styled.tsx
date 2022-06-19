import { Stack, styled } from '@mui/material'

export const FixedContainer = styled(Stack)`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.modal};
  width: 100%;
  bottom: 15px;
  padding: ${({ theme }) => theme.spacing(0, 2)};
`

export const Container = styled(Stack)`
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  padding: ${({ theme }) => theme.spacing(2)};
  background: white;
  width: 100%;
  max-width: 500px;
  margin: auto;
  border: 1px solid ${({ theme }) => theme.palette.divider};
`
