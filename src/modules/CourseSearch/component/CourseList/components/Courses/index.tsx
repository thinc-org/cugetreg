import { Typography } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import React from 'react'

import { CourseCard } from '@/modules/CourseSearch/component/CourseCard'

export interface CoursesProps {
  loading: boolean
  courses: Course[]
}

export const Courses: React.FC<CoursesProps> = ({ courses, loading }) => {
  if (!courses.length) {
    if (loading) return null

    return <Typography>No course match the filter</Typography>
  }

  return (
    <>
      {courses.map((course) => (
        <CourseCard key={`${course.courseNo}`} course={course} />
      ))}
    </>
  )
}
