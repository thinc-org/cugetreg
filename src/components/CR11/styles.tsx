import { makeStyles } from '@material-ui/core'
import { withTypography } from '@/hoc/withTypography'

export const useStyles = makeStyles((theme) => ({
  header: {
    background: theme.palette.primaryRange['30'],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
  table: {
    borderSpacing: '0',
    '& td, th': {
      width: '142px',
      textAlign: 'center',
      boxSizing: 'content-box',
    },
    '& th': {
      padding: theme.spacing(1, 4),
    },
    '& td': {
      padding: theme.spacing(0.5, 4),
    },
    '& td:nth-child(3)': {
      mixWidth: '316px',
      textAlign: 'left',
    },
    [theme.breakpoints.down('sm')]: {
      '& td:nth-child(1)': {
        display: 'none',
      },
      '& th:nth-child(1)': {
        display: 'none',
      },
      '& th:nth-child(3)': {
        textAlign: 'left',
      },
      '& th': {
        padding: theme.spacing(1, 0.5),
      },
      '& td': {
        padding: theme.spacing(0.5, 0.5),
      },
    },
    [theme.breakpoints.up('sm')]: {
      '& tr:nth-child(2) td': {
        paddingTop: theme.spacing(2),
      },
    },
  },
  totalCredit: {
    '& td': {
      paddingTop: theme.spacing(3),
    },
  },
  desktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  mobile: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}))

export const Column = withTypography((props) => <td {...props} />)
export const ColumnHeader = withTypography((props) => <th {...props} />)
