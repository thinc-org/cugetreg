import { styled } from '@material-ui/core'

export const NavItem = styled('a')(({ theme }) => ({
  ...theme.typography.h6,
  color: theme.palette.primary.main,

  // Extend hit target
  padding: theme.spacing(1),
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(-1),
}))
