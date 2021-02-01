import { useState } from 'react'
import { GenEd } from '@/utils/types'
import { Course } from '@thinc-org/chula-courses-types'

// interface Course {
//   id: number
//   name: string
//   credit: number
//   category: GenEd | null
// }

const useShoppingPanel = (data: Course[]) => {
  const [courses, setCourses] = useState<Course[]>(data)

  const credit: number = courses.reduce((acc: number, curr: Course) => acc + curr.credit, 0)

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((item) => item.courseNo !== id))
  }

  const makeSchedule = () => {
    console.log(courses)
  }

  return { credit, courses, deleteCourse, makeSchedule }
}

export default useShoppingPanel
