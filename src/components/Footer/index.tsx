import { makeStyles } from '@material-ui/core'
import { Banner } from './Banner'

const useStyles = makeStyles((theme) => ({
  footer: {
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.primary.dark,
  },
}))

export function Footer() {
  const classes = useStyles()
  return (
    <div className={classes.footer}>
      <Banner />
    </div>
  )
}
