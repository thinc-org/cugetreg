import { makeStyles } from '@material-ui/core'
import { Banner } from './Banner'
import { TopButton } from './TopButton'

const useStyles = makeStyles((theme) => ({
  footer: {
    boxShadow: theme.shadows[4],
    position: 'relative',
    height: 340,
  },
}))

export function Footer() {
  const classes = useStyles()
  return (
    <div className={classes.footer}>
      <TopButton />
      <Banner />
    </div>
  )
}
