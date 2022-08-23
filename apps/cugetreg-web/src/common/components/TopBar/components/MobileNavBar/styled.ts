import { IconButton, styled } from '@mui/material'

export const MoreButton = styled(IconButton)`
  margin-left: 12px;
  margin-right: -12px;
  color: ${({ theme }) => theme.palette.primary.main};
`

export const DrawerContent = styled('div')`
  width: 215px;
  display: flex;
  flex-direction: column;
  padding: 48px 28px;
`

export const SectionSpacer = styled('div')`
  height: 24px;
`
