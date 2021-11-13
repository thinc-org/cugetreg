import styled from '@emotion/styled'
import { Divider, Stack, Typography } from '@mui/material'

export const ResponsiveStack = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing(2, 0)};
  }
`

export const BannerContainer = styled(Stack)`
  height: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: ${({ theme }) => theme.spacing(3)};
`

export const PrivacyLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`

export const GithubLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;

  text-decoration: none;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`

export const StyledDivider = styled(Divider)`
  background: ${({ theme }) => theme.palette.primary.contrastText};
  margin: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

export const BannerSubtitle = styled(Typography)`
  margin-right: ${({ theme }) => theme.spacing(1)};
`

BannerSubtitle.defaultProps = { variant: 'subtitle1' }
