import CourseList from './CourseList'
import { Box, Button } from '@material-ui/core'
import { useEffect, useState } from 'react'

const exampleCourse = {
  id: 12345,
  name: 'URBAN ENVIRONMENT',
  credit: 2,
  color: 'green',
  category: 'Social Studies',
}
const exampleCourse2 = {
  id: 123445,
  name: 'URBAN ENVIRONMENT',
  credit: 1,
  color: 'green',
  category: null,
}
const exampleCourse3 = {
  id: 43241234,
  name: 'JAPANESE DESIGN CONCEPT',
  credit: 3,
  color: 'orange',
  category: 'Humanity',
}

interface Course {
  id: number
  name: string
  credit: number
  color: string
  category: string | null
}

const ShoppingPanel = () => {
  const [credit, setCredit] = useState(0)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const data = [exampleCourse, exampleCourse2, exampleCourse3] //TODO: - don't know what get pass; use mock data
    setCourses(data)
  }, [])

  useEffect(() => {
    setCredit(0)
    courses.map((course) => {
      if (course.credit !== null) {
        setCredit((prev) => {
          return prev + course.credit
        })
      }
    })
  }, [courses])

  const deleteCourse = (id: number, gened: boolean) => {
    setCourses(courses.filter((item) => item.id !== id))
  }

  const makeSchedule = () => {
    console.log(courses)
  }

  return (
    <Box className="container" p={2} bgcolor="white" width="100%" maxWidth={650}>
      <Box className="header" display="flex" alignItems="center" justifyContent="space-between">
        <h1>Selected Course</h1>
        <h2>Total {credit} credits</h2>
      </Box>
      <Box className="gened-course">
        <h2>GenEd Courses</h2>
        {courses.map((course) => {
          if (course.category !== null) {
            return <CourseList course={course} key={course.id} deleteCourse={deleteCourse} />
          }
        })}
      </Box>
      <Box className="other-course">
        <h2>Other Courses</h2>
        {courses.map((course) => {
          if (course.category === null) {
            return <CourseList course={course} key={course.id} deleteCourse={deleteCourse} />
          }
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
