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

export const Logo = styled('img')`
  width: 123px;
  height: 40px;
  margin-left: 8px;
  margin-bottom: 42px;
`

export const SectionSpacer = styled('div')`
  height: 24px;
`

export const ThemeToggleButtonContainer = styled('div')`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-left: ${({ theme }) => theme.spacing(2)};
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  }
`
