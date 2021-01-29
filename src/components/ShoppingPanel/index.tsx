import CourseList from './CourseList'
import { Box, Button } from '@material-ui/core'
import useShoppingPanel from '@/hooks/useShoppingPanel.ts'

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
    <Box className="container" p={2} bgcolor="white" width="100%" maxWidth={650}>
      <Box className="header" display="flex" alignItems="center" justifyContent="space-between">
        <h1>Selected Course</h1>
        <h2>Total {credit} credits</h2>
      </Box>
      <Box className="gened-course">
        <h2>GenEd Courses</h2>
        {courses.map((course) => {
          return course.category && <CourseList course={course} key={course.id} deleteCourse={deleteCourse} />
        })}
      </Box>
      <Box className="other-course">
        <h2>Other Courses</h2>
        {courses.map((course) => {
          return !course.category && <CourseList course={course} key={course.id} deleteCourse={deleteCourse} />
        })}
      </Box>
      <Box mt={6}>
        <Button fullWidth variant="contained" color="primary" onClick={makeSchedule}>
          Make Schedule
        </Button>
      </Box>
    </Box>
  )
}

export default ShoppingPanel
