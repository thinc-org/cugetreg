import { makeStyles } from '@material-ui/core'

export const useSharedStyles = makeStyles((theme) => ({
  inputField: {
    padding: theme.spacing(1.25, 2),
    borderRadius: theme.spacing(0.5),
    border: `1.5px solid ${theme.palette.primaryRange[100]}`,
  },
}))
