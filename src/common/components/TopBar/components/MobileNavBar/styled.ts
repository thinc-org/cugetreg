import styled from '@emotion/styled'
import { IconButton } from '@mui/material'

export const MoreButton = styled(IconButton)`
  margin-left: 12px;
  margin-right: -12px;
  color: ${({ theme }) => theme.palette.primary.main};
`

export const DrawerContent = styled.div`
  width: 215px;
  display: flex;
  flex-direction: column;
  padding: 48px 28px;
`

export const Logo = styled.div`
  width: 123px;
  height: 40px;
  margin-left: 8px;
  margin-bottom: 42px;
  position: relative;
`

export const SectionSpacer = styled.div`
  height: 24px;
`
