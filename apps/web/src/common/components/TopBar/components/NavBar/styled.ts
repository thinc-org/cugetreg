import { styled } from '@mui/material'

export const NavBarLayout = styled('div')`
  width: 100%;
  height: 84px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.primary.main};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 60px;
  }
`

export const Logo = styled('a')`
  margin-left: ${({ theme }) => theme.spacing(-2)};
  padding: ${({ theme }) => theme.spacing(0, 2)};

  &,
  img {
    height: 40px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      height: 24px;
    }
  }
`
