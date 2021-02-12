import { makeStyles, Typography, TypographyProps } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  cardBody: {
    display: 'grid',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
      grid: '"top" auto "body" auto "detail" auto "action" auto / 1fr',
    },
    [theme.breakpoints.up('sm')]: {
      grid: '"top top" auto "body action" auto "detail action" auto / 1fr auto',
      padding: theme.spacing(4),
    },
  },
  top: {
    gridArea: 'top',
    display: 'grid',
    gridGap: theme.spacing(1),
    alignItems: 'start',
    [theme.breakpoints.down('sm')]: {
      grid: '"header chev" auto / auto auto',
    },
    [theme.breakpoints.up('sm')]: {
      grid: '"header starTop chev" auto / 1fr auto auto',
    },
  },
  header: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  genedTop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'inline-flex',
    },
  },
  starTop: {
    gridArea: 'starTop',
    alignItems: 'end',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  chev: { gridArea: 'chev' },

  body: {
    gridArea: 'body',
    display: 'grid',
    [theme.breakpoints.down('sm')]: {
      grid: '"dayChip genedBody" auto "totalCapacity starBody" auto / auto auto',
      gridGap: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      grid: '"dayChip totalCapacity" auto / auto 1fr',
      gridGap: theme.spacing(2, 4),
    },
  },
  dayChip: { gridArea: 'dayChip' },
  genedBody: {
    gridArea: 'genedBody',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  totalCapacity: { gridArea: 'totalCapacity' },
  starBody: {
    gridArea: 'starBody',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  detail: {
    gridArea: 'detail',
    display: 'grid',
    gridGap: theme.spacing(2, 4),
    [theme.breakpoints.down('sm')]: {
      grid: '"select teacher" auto "time classRoom" auto "note capacity" auto / 1fr 1fr',
    },
    [theme.breakpoints.up('sm')]: {
      grid: '"teacher time classRoom note capacity" auto / auto auto auto auto 1fr',
    },
  },
  select: {
    gridArea: 'select',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  teacher: { gridArea: 'teacher' },
  time: { gridArea: 'time', whiteSpace: 'nowrap' },
  classRoom: { gridArea: 'classRoom', whiteSpace: 'nowrap' },
  note: { gridArea: 'note' },
  capacity: { gridArea: 'capacity' },

  action: {
    gridArea: 'action',
    display: 'grid',
    [theme.breakpoints.down('sm')]: {
      // grid: '"button" auto / 1fr',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    [theme.breakpoints.up('sm')]: {
      grid: '"selectAction" 1fr "button" auto / auto',
    },
  },
  button: { gridArea: 'button', alignSelf: 'start' },
  selectAction: {
    gridArea: 'selectAction',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  caption: {
    color: theme.palette.primaryRange[100],
  },
}))

export const Label = (props: TypographyProps) => {
  const classes = useStyles()
  return <Typography variant="caption" className={classes.caption} {...props} />
}
