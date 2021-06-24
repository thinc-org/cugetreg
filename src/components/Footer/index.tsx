import { makeStyles } from '@material-ui/core'
import { Banner } from './Banner'
import { TopButton } from './TopButton'

const useStyles = makeStyles((theme) => ({
  footer: {
    marginTop: 'auto',
    boxShadow: theme.shadows[4],
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: '240px',
    },
    [theme.breakpoints.up('sm')]: {
      height: '340px',
    },
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
