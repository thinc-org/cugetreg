import Course from './Course'
import { Box, Button, Typography, makeStyles } from '@material-ui/core'
import useShoppingPanel from '@/hooks/useShoppingPanel.ts'
import TableChartIcon from '@material-ui/icons/TableChart'

const mockData = [
  {
    id: 12345,
    name: 'URBAN ENVIRONMENT',
    credit: 2,
    color: 'green',
    category: 'Socials',
  },
  {
    id: 123445,
    name: 'URBAN ENVIRONMENT',
    credit: 1,
    color: 'green',
    category: null,
  },
  {
    id: 43241234,
    name: 'JAPANESE DESIGN CONCEPT',
    credit: 3,
    color: 'orange',
    category: 'Humanity',
  },
]

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '50px 45px 30px 45px',
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 650,
    borderRadius: 4,
    boxShadow: theme.shadows[2],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  course: {
    marginTop: 25,
    marginBottom: 17,
  },
  makeScheduleButton: {
    marginTop: 70,
  },
  makeScheduleText: {
    marginLeft: 10,
  },
}))

const ShoppingPanel = () => {
  const { credit, courses, deleteCourse, makeSchedule } = useShoppingPanel(mockData)

  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Typography variant="h4">Selected Course</Typography>
        <Typography variant="h6">Total {credit} Credits</Typography>
      </Box>
      <Box>
        <Typography className={classes.course} variant="h6">
          GenEd Courses
        </Typography>
        {courses.map((course) => {
          return course.category && <Course course={course} key={course.id} deleteCourse={deleteCourse} />
        })}
      </Box>
      <Box>
        <Typography className={classes.course} variant="h6">
          Other Courses
        </Typography>
        {courses.map((course) => {
          return !course.category && <Course course={course} key={course.id} deleteCourse={deleteCourse} />
        })}
      </Box>
      <Box className={classes.makeScheduleButton}>
        <Button fullWidth variant="contained" color="primary" onClick={makeSchedule}>
          <TableChartIcon></TableChartIcon>
          <Box className={classes.makeScheduleText}>
            <Typography variant="button">{t('shoppingPanel:makeSchedule')}</Typography>
          </Box>
        </Button>
      </Box>
    </Box>
  )
}

export default ShoppingPanel
