import React from 'react'
import { Course } from '@thinc-org/chula-courses'
import { CourseCard } from '@/components/CourseCard'
import { Typography } from '@material-ui/core'

export interface CoursesProps {
  loading: boolean
  isRefetching: boolean
  courses: Course[]
}

export const Courses: React.FC<CoursesProps> = ({ courses, loading, isRefetching }) => {
  if (!courses.length || isRefetching) {
    if (loading || isRefetching) return null

    return <Typography>404 Not Found</Typography>
  }

  return (
    <>
      {courses.map((course) => (
        <CourseCard key={`${course.courseNo}`} course={course} />
      ))}
    </>
  )
}
