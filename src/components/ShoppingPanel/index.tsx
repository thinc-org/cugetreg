import Course from './Course'
import { Box, Button, Typography } from '@material-ui/core'
import useShoppingPanel from '@/hooks/useShoppingPanel.ts'
import TableChartIcon from '@material-ui/icons/TableChart'

const mockData = [
  {
    id: 12345,
    name: 'URBAN ENVIRONMENT',
    credit: 2,
    color: 'green',
    category: 'Social Studies',
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

const ShoppingPanel = () => {
  const { credit, courses, deleteCourse, makeSchedule } = useShoppingPanel(mockData)

  return (
    <Box className="container" p={2} bgcolor="white" width="100%" maxWidth={650} borderRadius={4}>
      <Box className="header" display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h1">Selected Course</Typography>
        <Typography variant="h2">Total {credit} Credits</Typography>
      </Box>
      <Box className="gened-course">
        <Typography variant="h2">GenEd Courses</Typography>
        {courses.map((course) => {
          return course.category && <Course course={course} key={course.id} deleteCourse={deleteCourse} />
        })}
      </Box>
      <Box className="other-course">
        <Typography variant="h2">Other Courses</Typography>
        {courses.map((course) => {
          return !course.category && <Course course={course} key={course.id} deleteCourse={deleteCourse} />
        })}
      </Box>
      <Box mt={6}>
        <Button fullWidth variant="contained" color="primary" onClick={makeSchedule}>
          <TableChartIcon></TableChartIcon>
          <Box ml={1}>
            <Typography variant="body1">Make Schedule</Typography>
          </Box>
        </Button>
      </Box>
    </Box>
  )
}

export default ShoppingPanel
