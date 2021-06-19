import { styledWithTheme } from '@/utils/styledWithTheme'
import { Button } from '@material-ui/core'

export const NavBarItem = styledWithTheme(Button)((theme) => ({
  ...theme.typography.h6,
  color: theme.palette.primary.main,

  // Extend hit target
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(-1),
}))
