import { IconButton, styled } from '@mui/material'

export const IconButtonWithBorder = styled(IconButton)`
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
`
