import CourseList from './components/CourseList'
import { Course } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'
import { Typography, makeStyles } from '@material-ui/core'
import { useShoppingPanel } from '@/components/ShoppingPanel/hooks'
import { CourseCartItem, courseCartStore } from '@/store'
import { ActionButton } from '@/components/ShoppingPanel/components/ActionButton'

export interface CoursePropsType {
  data: Course[]
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(6.25, 5.625, 3.75, 5.625),
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    maxWidth: theme.breakpoints.values.sm,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  course: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  makeScheduleButton: {
    marginTop: theme.spacing(3),
  },
  makeScheduleText: {
    marginLeft: theme.spacing(1.25),
  },
}))

const ShoppingPanel = () => {
  const classes = useStyles()
  const { shopItems } = courseCartStore
  const { shoppingState, selectedCourses, removeAllSelectedCourses, onCheckboxChange } = useShoppingPanel()

  const { t } = useTranslation('shoppingPanel')

  const credits = shopItems.reduce((prev, { credit }) => prev + credit, 0)

  const sortCourse = (courseA: CourseCartItem, courseB: CourseCartItem) => {
    return courseA.courseNo.localeCompare(courseB.courseNo)
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h4">{t('selectedCourse')}</Typography>
        <Typography variant="h6"> {t('totalCredit', { totalCredit: credits })}</Typography>
      </div>
      <div>
        <Typography className={classes.course} variant="h6">
          {t('genedCourse')}
        </Typography>
        {shopItems.sort(sortCourse).map((course: CourseCartItem) => {
          return (
            course.genEdType !== 'NO' && (
              <CourseList key={course.courseNo} course={course} onChange={onCheckboxChange} />
            )
          )
        })}
      </div>
      <div>
        <Typography className={classes.course} variant="h6">
          {t('otherCourse')}
        </Typography>
        {shopItems.sort(sortCourse).map((course: CourseCartItem) => {
          return (
            course.genEdType === 'NO' && (
              <CourseList key={course.courseNo} course={course} onChange={onCheckboxChange} />
            )
          )
        })}
      </div>
      <div className={classes.makeScheduleButton}>
        <ActionButton
          status={shoppingState}
          selectedCoursesNumnber={selectedCourses.length}
          removeAllSelectedCourses={removeAllSelectedCourses}
        />
      </div>
    </div>
  )
}

export default ShoppingPanel
