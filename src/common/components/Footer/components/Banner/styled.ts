import styled from '@emotion/styled'
import { Stack, Typography } from '@material-ui/core'

export const StyledStack = styled(Stack)`
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const BannerContaienr = styled(StyledStack)`
  height: 100%;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: ${({ theme }) => theme.spacing(3)};
`

export const PrivacyLink = styled.div`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`

export const GithubLink = styled(Stack)`
  cursor: pointer;
`

export const BannerSubtitle = styled(Typography)`
  margin-right: ${({ theme }) => theme.spacing(1)};
`

BannerSubtitle.defaultProps = { variant: 'subtitle1' }
