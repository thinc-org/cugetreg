import { CourseCartItem } from '@/store/shoppingCart'
import { useTranslation } from 'react-i18next'
import { useStyles, Column, ColumnHeader } from './styles'
import { toNumberString } from './utils'

interface PropTypes {
  courses?: CourseCartItem[]
}

export function CR11({ courses }: PropTypes) {
  const classes = useStyles()
  const filteredCourses = courses?.filter((course) => !course.isHidden)
  const totalCredit = filteredCourses?.reduce((accumulator, course) => accumulator + course.credit, 0)
  const { t } = useTranslation('cr11')

  const Items = filteredCourses?.map((course, i) => {
    return (
      <tr key={course.courseNo}>
        <Column variant="body1">{i + 1}</Column>
        <Column variant="body1">{course.courseNo}</Column>
        <Column variant="body1">{course.abbrName}</Column>
        <Column variant="body1">
          {course.selectedSectionNo} {t('only')}
        </Column>
        <Column variant="body1">{toNumberString(course.credit)}</Column>
      </tr>
    )
  })

  return (
    <table className={classes.table}>
      <tbody>
        <tr className={classes.header}>
          <ColumnHeader variant="h6">{t('order')}</ColumnHeader>
          <ColumnHeader variant="h6">
            <span className={classes.desktop}>{t('courseNo')}</span>
            <span className={classes.mobile}>{t('courseNoMobile')}</span>
          </ColumnHeader>
          <ColumnHeader variant="h6">{t('abbrName')}</ColumnHeader>
          <ColumnHeader variant="h6">{t('section')}</ColumnHeader>
          <ColumnHeader variant="h6">
            <span className={classes.desktop}>{t('credit')}</span>
            <span className={classes.mobile}>{t('creditMobile')}</span>
          </ColumnHeader>
        </tr>
        {Items}
        <tr className={classes.totalCredit}>
          <td></td>
          <td></td>
          <td></td>
          <Column variant="h6">{t('totalCredit')}</Column>
          <Column variant="h6">{toNumberString(totalCredit)}</Column>
        </tr>
      </tbody>
    </table>
  )
}
