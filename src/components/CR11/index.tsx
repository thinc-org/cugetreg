import { Course } from '@thinc-org/chula-courses'
import { useStyles, Column, ColumnHeader } from './styles'

interface PropTypes {
  courses?: Course[]
}

export function CR11({ courses }: PropTypes) {
  const classes = useStyles()
  const totalCredit = courses?.reduce((accumulator, course) => accumulator + course.credit, 0)
  const Items = courses?.map((course, i) => {
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
    <table className={classes.table}>
      <tr className={classes.header}>
        <ColumnHeader variant="h6">ลำดับที่</ColumnHeader>
        <ColumnHeader variant="h6">
          <span className={classes.desktop}>รหัสรายวิชา</span>
          <span className={classes.mobile}>รหัสวิชา</span>
        </ColumnHeader>
        <ColumnHeader variant="h6">ชื่อย่อรายวิชา</ColumnHeader>
        <ColumnHeader variant="h6">ตอนเรียน</ColumnHeader>
        <ColumnHeader variant="h6">
          <span className={classes.desktop}>หน่วยกิต</span>
          <span className={classes.mobile}>หน่วย</span>
        </ColumnHeader>
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
  )
}
