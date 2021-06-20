import { withTypography } from '@/hoc/withTypography'
import { makeStyles } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'

const useStyles = makeStyles((theme) => ({
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
      width: '316px',
      textAlign: 'left',
    },
    '& tr:nth-child(2) td': {
      paddingTop: theme.spacing(2),
    },
  },
  totalCredit: {
    '& td': {
      paddingTop: theme.spacing(3),
    },
  },
}))

const Column = withTypography((props) => <td {...props} />)
const ColumnHeader = withTypography((props) => <th {...props} />)

interface PropTypes {
  courses?: Course[]
}

export function CR11({ courses }: PropTypes) {
  const classes = useStyles()
  const totalCredit = courses?.reduce((accumulator, course) => accumulator + course.credit, 0)
  const Items = courses?.map((course, i) => {
    console.log(course.sections[0].sectionNo, 'course')
    return (
      <tr key={course.courseNo}>
        <Column variant="body1">{i + 1}</Column>
        <Column variant="body1">{course.courseNo}</Column>
        <Column variant="body1">{course.abbrName}</Column>
        <Column variant="body1">{course.sections[0].sectionNo} เท่านั้น</Column>
        <Column variant="body1">{course.credit}.0</Column>
      </tr>
    )
  })
  return (
    <div>
      <table className={classes.table}>
        <tr className={classes.header}>
          <ColumnHeader variant="h6">ลำดับที่</ColumnHeader>
          <ColumnHeader variant="h6">รหัสรายวิชา</ColumnHeader>
          <ColumnHeader variant="h6">ชื่อย่อรายวิชา</ColumnHeader>
          <ColumnHeader variant="h6">ตอนเรียน</ColumnHeader>
          <ColumnHeader variant="h6">หน่วยกิต</ColumnHeader>
        </tr>
        {Items}
        <tr className={classes.totalCredit}>
          <td></td>
          <td></td>
          <td></td>
          <Column variant="h6">หน่วยกิตรวม</Column>
          <Column variant="h6">{totalCredit}.0</Column>
        </tr>
      </table>
    </div>
  )
}
