import { useState } from 'react'

interface Course {
  id: number
  name: string
  credit: number
  color: string
  category: string | null
}

const useShoppingPanel = (data: Course[]) => {
  const [courses, setCourses] = useState<Course[]>(data)

  const credit: number = courses.reduce((acc: number, curr: Course) => acc + curr.credit, 0)

  const deleteCourse = (id: number) => {
    setCourses(courses.filter((item) => item.id !== id))
  }

  const makeSchedule = () => {
    console.log(courses)
  }

  return { credit, courses, deleteCourse, makeSchedule }
}

export default useShoppingPanel
