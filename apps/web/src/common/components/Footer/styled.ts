import { styled } from '@mui/material'

export const FooterContainer = styled('div')`
  height: 340px;
  margin-top: auto;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  position: relative;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 240px;
  }
`
