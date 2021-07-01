import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 0.5),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    paddingLeft: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  iconButton: {
    padding: theme.spacing(1),
  },
}))
