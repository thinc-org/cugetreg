import React from 'react'

import { Stack } from '@material-ui/core'
import { Loading } from '@/components/Loading'
import { Error } from '@/components/Error'
import { RenderOnIntersect } from '../RenderOnIntersect'
import { useCourseList } from '@/components/CourseList/hooks'
import { Courses } from '@/components/CourseList/components/Courses'

export interface CourseListProps {}

export const CourseList: React.FC<CourseListProps> = () => {
  const { courses, loading, error, isRefetching } = useCourseList()

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Courses loading={loading} courses={courses} isRefetching={isRefetching} />
      <Loading loading={loading} />
      {error && <Error message={error.message} />}
    </Stack>
  )
}
