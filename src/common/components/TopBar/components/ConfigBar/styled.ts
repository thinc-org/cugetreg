import styled from '@emotion/styled'

export const ConfigBarLayout = styled.div`
  width: 100%;
  height: 40px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primaryRange[10]};

  ${({ theme }) => theme.breakpoints.down('md')} {
    display: none;
  }
`

export const ConfigBarItem = styled.span`
  // Extend hit target
  padding: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(-1)};

  color: inherit;
  margin-left: ${({ theme }) => theme.spacing(3.5)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: ${({ theme }) => theme.spacing(2.5)};
  }
`

export const ConfigBarItemLink = ConfigBarItem.withComponent('a')
