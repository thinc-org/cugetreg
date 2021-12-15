import styled from '@emotion/styled'
import { Button } from '@mui/material'

export const ToastAction = styled(Button)`
  height: 100%;
  padding: 0 16px;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 0;

  &:last-child {
    border-radius: 0 3px 3px 0;
  }
`
