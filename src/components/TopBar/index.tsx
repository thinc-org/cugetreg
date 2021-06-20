import { makeStyles } from '@material-ui/core'
import { NavBar } from './NavBar'
import { ConfigBar } from './ConfigBar'
import { Hidden } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  topBar: {
    boxShadow: theme.shadows[4],
  },
}))

export function TopBar() {
  const classes = useStyles()
  return (
    <div className={classes.topBar}>
      <Hidden smDown>
        <ConfigBar />
      </Hidden>
      <NavBar />
    </div>
  )
}
