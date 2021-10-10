import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 0.5),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: '100%',
    paddingLeft: theme.spacing(2),
  },
  iconButton: {
    padding: theme.spacing(1),
  },
}))
