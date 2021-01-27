import { styled } from '@material-ui/core'

export const NavItem = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 18,

  // Extend hit target
  padding: 8,
  marginLeft: 16,
  marginRight: -8,
}))
