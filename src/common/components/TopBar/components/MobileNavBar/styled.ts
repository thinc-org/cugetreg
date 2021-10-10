import styled from '@emotion/styled'
import { IconButton } from '@material-ui/core'

export const MoreButton = styled(IconButton)`
  margin-left: 12px;
  margin-right: -12px;
  color: ${({ theme }) => theme.palette.primary.main};
`

export const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 48px;
  padding-left: 28px;
  padding-right: 56px;
  padding-bottom: 48px;
`

export const Logo = styled.img`
  height: 40px;
  margin-left: 8px;
  margin-bottom: 42px;
`

export const SectionSpacer = styled.div`
  height: 24px;
`
