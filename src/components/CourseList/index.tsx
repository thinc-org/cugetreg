import React, { useContext } from 'react'

import { Stack } from '@material-ui/core'
import { CourseCard } from '@/components/CourseCard'
import { CourseSearchContext } from '@/context/CourseSearch'
import { Loading } from '@/components/Loading'
import { Error } from '@/components/Error'
import { RenderOnIntersect } from '../RenderOnIntersect'

export interface CourseListProps {}

export const CourseList: React.FC<CourseListProps> = () => {
  const { courseSearchQuery } = useContext(CourseSearchContext)
  if (!courseSearchQuery) return null

  const { data, loading, error } = courseSearchQuery

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error message={error.message} />
  }
  if (!data?.search.length) {
    return <Error message="NOT FOUND" />
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {data.search.map((result) => (
        <RenderOnIntersect key={result.courseNo} id={result.courseNo} initialHeight={158}>
          <CourseCard key={result.courseNo} course={result} />
        </RenderOnIntersect>
      ))}
    </Stack>
  )
}
