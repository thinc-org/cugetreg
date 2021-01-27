import { makeStyles } from '@material-ui/core'
import { NavBar } from './NavBar'
import { ConfigBar } from './ConfigBar'

const useStyles = makeStyles({
  topBar: {
    boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.12), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.12)',
  },
})

export function TopBar() {
  const classes = useStyles()
  return (
    <div className={classes.topBar}>
      <ConfigBar />
      <NavBar />
    </div>
  )
}
