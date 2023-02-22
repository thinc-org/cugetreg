import React from 'react'

import { Typography } from '@mui/material'
import { getCourseKeyString } from '@web/common/utils/getCourseKeyString'
import { CourseCard } from '@web/modules/CourseSearch/components/CourseCard'

import { Course } from '@cgr/codegen'

export interface CoursesProps {
  loading: boolean
  courses: Course[]
}

export const Courses: React.FC<CoursesProps> = ({ courses, loading }) => {
  if (!courses.length) {
    if (loading) return null

    return (
      <>
        <Typography align="center" variant="h5" mt={4}>
          ไม่พบรายวิชา
        </Typography>
        <Typography align="center" variant="subtitle1">
          ลองเปลี่ยนภาคเรียนที่มุมบนขวา
        </Typography>
      </>
    )
  }

  return (
    <>
      {courses.map((course) => (
        <CourseCard key={getCourseKeyString(course)} course={course} />
      ))}
    </>
  )
}
