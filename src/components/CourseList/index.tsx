import React, { useContext } from 'react'

import { Stack } from '@material-ui/core'
import { CourseCard } from '@/components/CourseCard'
import { CourseSearchContext } from '@/context/CourseSearch'

export interface CourseListProps {}

export const CourseList: React.FC<CourseListProps> = () => {
  const { courseSearchQuery } = useContext(CourseSearchContext)
  if (!courseSearchQuery) return null

  const { data, loading, error } = courseSearchQuery

  if (loading) {
    return <>loading</>
  }
  if (error) {
    return <>error</>
  }
  if (!data) {
    return <>NOT FOUND</>
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {data.search.map((result) => (
        <CourseCard key={result.courseNo} course={result} />
      ))}
    </Stack>
  )
}
