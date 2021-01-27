import { styled } from '@material-ui/core'

export const NavItem = styled('a')(({ theme }) => ({
  ...theme.typography.h6,
  color: theme.palette.primary.main,

  // Extend hit target
  padding: 8,
  marginLeft: 16,
  marginRight: -8,
}))
