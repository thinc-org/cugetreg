import styled from '@emotion/styled'
import { Stack } from '@material-ui/core'

export const NavBarItemDiv = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};

  font-size: 20px;
  flex-direction: column;

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: flex;
    align-items: center;
  }
`

export const SyncContainer = styled(Stack)`
  &:first-child {
    margin-right: ${({ theme }) => theme.spacing(1)};
  }

  ${({ theme }) => theme.breakpoints.down('md')} {
    margin-left: ${({ theme }) => theme.spacing(1)};
  }
`

export const UserContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing(1)};
`
