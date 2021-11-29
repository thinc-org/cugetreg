import styled from '@emotion/styled'
import { Alert } from '@mui/material'

export const ToastAlert = styled(Alert)`
  div:last-child {
    padding: ${({ theme }) => theme.spacing(0, 0, 0, 2)};
  }
`
