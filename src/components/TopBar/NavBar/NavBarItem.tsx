import { styledWithTheme } from '@/utils/styledWithTheme'
import { Button } from '@material-ui/core'

export const NavBarItem = styledWithTheme(Button)((theme) => ({
  ...theme.typography.h6,
  color: theme.palette.primary.main,

  [theme.breakpoints.up('sm')]: {
    // Extend hit target
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(-1),
  },

  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
  },
}))
