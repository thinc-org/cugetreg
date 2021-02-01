import { makeStyles, styled } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  textField: { ...theme.typography.subtitle1 },
  field: {
    padding: theme.spacing(1.25, 2),
    borderRadius: theme.spacing(0.5),
    border: '1.5px solid #9C9FBA',
    width: 230,
    boxSizing: 'border-box',
  },
  input: {
    padding: 0,
  },
  dateIcon: {
    padding: 0,
    color: theme.palette.primaryRange[100],
  },
  select: {
    '& .MuiInput-formControl': {
      margin: 0,
    },
  },
  search: {
    color: theme.palette.primaryRange[100],
  },
  button: {
    width: 230,
    padding: theme.spacing(0.75, 2),
    borderRadius: theme.spacing(0.5),
  },
}))

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  '& > *': {
    marginTop: theme.spacing(4.5),
  },
}))
