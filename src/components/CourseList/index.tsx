import React, { useContext } from 'react'

import { Stack } from '@material-ui/core'
import { CourseCard } from '@/components/CourseCard'
import { CourseSearchContext } from '@/context/CourseSearch'

export interface CourseListProps {}

export const CourseList: React.FC<CourseListProps> = () => {
  const { courses, loading, error } = useContext(CourseSearchContext)

  if (loading) {
    return <>loading</>
  }
  if (error) {
    return <>error</>
  }
  if (!courses) {
    return <>NOT FOUND</>
  }

  return (
    <Stack spacing={2}>
      {courses.search.map((result) => (
        <CourseCard key={result.courseNo} course={result} />
      ))}
    </Stack>
  )
}
