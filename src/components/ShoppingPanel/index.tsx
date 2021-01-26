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
  const [credit, useCredit] = useState(0)
  const [genedCourse, setGenedCourse] = useState<Course[]>([])
  const [otherCourse, setOtherCourse] = useState<Course[]>([])

  useEffect(() => {
    const data = [exampleCourse, exampleCourse2, exampleCourse3] //TODO: - don't know what get pass; use mock data

    data.map((course) => {
      if (course.credit !== null) {
        useCredit((prev) => {
          return prev + course.credit
        })
      }
      if (course.category !== null) {
        setGenedCourse((prev) => {
          return [...prev, course]
        })
      } else {
        setOtherCourse((prev) => {
          return [...prev, course]
        })
      }
    })
  }, [])

  return (
    <Box className="container" m={2}>
      <Box className="header" display="flex" alignItems="center" justifyContent="space-between">
        <h1>Selected Course</h1>
        <h2>Total {credit} credits</h2>
      </Box>
      <Box className="gened-course">
        <h2>GenEd Courses</h2>
        {genedCourse.map((course) => (
          <CourseList course={course} key={course.id} />
        ))}
      </Box>
      <Box className="other-course">
        <h2>Other Courses</h2>
        {otherCourse.map((course) => (
          <CourseList course={course} key={course.id} />
        ))}
      </Box>
      <Box mt={6}>
        <Button fullWidth variant="contained" color="primary">
          Make Schedule
        </Button>
      </Box>
    </Box>
  )
}

export default ShoppingPanel
