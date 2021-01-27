import { Button, styled } from '@material-ui/core'

export const NavBarItem = styled(Button)(({ theme }) => ({
  ...theme.typography.h6,
  color: theme.palette.primary.main,

  // Extend hit target
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(-1),
}))
