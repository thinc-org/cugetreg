import { makeStyles, Typography, TypographyProps } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(4, 4, 0, 4),
  },
  body: {
    padding: theme.spacing(2, 4),
  },
  action: {
    padding: theme.spacing(0, 4, 4, 4),
  },
  caption: {
    color: theme.palette.primaryRange[100],
  },
  detail: {
    padding: theme.spacing(4, 0, 0, 0),
  },
  textStar: {
    display: 'flex',
    verticalAlign: 'middle',
    '& svg': {
      margin: theme.spacing(0, 1, 0, 0),
    },
  },
  // fullWidth: {
  //   width: '100%',
  // },
}))

export const Label = (props: TypographyProps) => {
  const classes = useStyles()
  return <Typography variant="caption" className={classes.caption} {...props} />
}
