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
  display: flex;
  ${({ theme }) => theme.breakpoints.down('md')} {
    margin-left: ${({ theme }) => theme.spacing(1)};
  }
`

export const UserContainer = styled.div`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(1)};
  overflow: hidden;

  h6 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
