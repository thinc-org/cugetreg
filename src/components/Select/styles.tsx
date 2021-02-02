import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  input: {
    padding: 0,
  },
  select: {
    '& svg': {
      color: theme.palette.primaryRange[100],
    },
    '& .MuiInput-formControl': {
      margin: 0,
    },
  },
}))
