import { styledWithTheme } from '@/utils/styledWithTheme'
import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  input: {
    padding: 0,
  },
  search: {
    color: theme.palette.primaryRange[100],
  },
  button: {
    padding: theme.spacing(0.75, 2),
    borderRadius: theme.spacing(0.5),
    boxShadow: 'none',
  },
}))

export const AnnouncementSearchContainer = styledWithTheme('div')((theme) => ({
  display: 'flex',
  flexDirection: 'column',
  '& > *': {
    marginBottom: theme.spacing(4.5),
  },
  width: 230,
}))
