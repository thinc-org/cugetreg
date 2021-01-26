import CourseList from './CourseList'
import { Box } from '@material-ui/core'

const exampleCourse = {
  id: 12345,
  name: 'URBAN ENVIRONMENT',
  credit: 2,
  color: 'green',
  category: 'Social Studies',
}
const exampleCourse2 = {
  id: 12345,
  name: 'URBAN ENVIRONMENT',
  credit: 2,
  color: 'green',
  category: null,
}

const ShoppingPanel = () => {
  return (
    <Box className="container" m={2}>
      <Box className="header" display="flex" alignItems="center" justifyContent="space-between">
        <h1>Selected Course</h1>
        <h2>Total 17 credits</h2>
      </Box>
      <Box className="gened-course">
        <h2>Gened Courses</h2>
        <CourseList course={exampleCourse} />
        <CourseList course={exampleCourse} />
        <CourseList course={exampleCourse} />
      </Box>
      <Box className="other-course">
        <h2>Other courses</h2>
        <CourseList course={exampleCourse2} />
        <CourseList course={exampleCourse2} />
        <CourseList course={exampleCourse2} />
      </Box>
    </Box>
  )
}

export default ShoppingPanel
