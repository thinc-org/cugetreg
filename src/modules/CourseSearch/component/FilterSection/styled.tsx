import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    overflow: 'scroll',
    maxHeight: 'calc(100vh - 130px)',
  },
}))
