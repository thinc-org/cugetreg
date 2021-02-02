import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles({
  input: {
    padding: 0,
  },
  select: {
    '& .MuiInput-formControl': {
      margin: 0,
    },
  },
})
