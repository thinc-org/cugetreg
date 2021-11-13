import styled from '@emotion/styled'
import { Stack } from '@mui/material'

export const NavBarItemDiv = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};

  font-size: 20px;
  flex-direction: column;

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
`

export const SyncContainer = styled(Stack)`
  ${({ theme }) => theme.breakpoints.down('md')} {
    margin-left: ${({ theme }) => theme.spacing(1)};
  }
`

export const UserContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing(1)};
`
