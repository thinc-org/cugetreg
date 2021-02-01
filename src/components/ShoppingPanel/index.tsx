import CourseList from './CourseList'
import { mockData } from './mockData'
import { useTranslation } from 'react-i18next'
import { Button, Typography, makeStyles } from '@material-ui/core'
import useShoppingPanel from '@/hooks/useShoppingPanel.ts'
import TableChartIcon from '@material-ui/icons/TableChart'

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
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  makeScheduleButton: {
    marginTop: theme.spacing(8.25),
  },
  makeScheduleText: {
    marginLeft: theme.spacing(1.25),
  },
}))

const ShoppingPanel = () => {
  const { credit, courses, deleteCourse, makeSchedule } = useShoppingPanel(mockData)
  const { t } = useTranslation('shoppingPanel')
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h4">{t('selectedCourse')}</Typography>
        <Typography variant="h6"> {t('totalCredit', { totalCredit: credit })}</Typography>
      </div>
      <div>
        <Typography className={classes.course} variant="h6">
          {t('genedCourse')}
        </Typography>
        {courses.map((course) => {
          return course.genEdType && <CourseList course={course} key={course.courseNo} deleteCourse={deleteCourse} />
        })}
      </div>
      <div>
        <Typography className={classes.course} variant="h6">
          {t('otherCourse')}
        </Typography>
        {courses.map((course) => {
          return !course.genEdType && <CourseList course={course} key={course.courseNo} deleteCourse={deleteCourse} />
        })}
      </div>
      <div className={classes.makeScheduleButton}>
        <Button fullWidth variant="contained" color="primary" onClick={makeSchedule}>
          <TableChartIcon />
          <div className={classes.makeScheduleText}>
            <Typography variant="button">{t('makeSchedule')}</Typography>
          </div>
        </Button>
      </div>
    </div>
  )
}

export default ShoppingPanel
