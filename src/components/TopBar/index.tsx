import { makeStyles } from '@material-ui/core'
import { NavBar } from './NavBar'
import { ConfigBar } from './ConfigBar'

const useStyles = makeStyles((theme) => ({
  topBar: {
    boxShadow: theme.shadows[4],
  },
}))

export function TopBar() {
  const classes = useStyles()
  return (
    <div className={classes.topBar}>
      <ConfigBar />
      <NavBar />
    </div>
  )
}
