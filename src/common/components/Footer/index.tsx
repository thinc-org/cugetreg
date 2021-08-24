import { makeStyles } from '@material-ui/core'

import { Banner } from './components/Banner'
import { TopButton } from './components/TopButton'

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
