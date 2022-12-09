import { styled } from '@mui/material'

export const BarContainer = styled('div')`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.highlight.blue[300]};
  padding: ${({ theme }) => theme.spacing(0.5, 3)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`
