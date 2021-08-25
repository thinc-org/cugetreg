import { Stack } from '@material-ui/core'
import React from 'react'

import { Error } from '@/common/components/Error'
import { Courses } from '@/modules/CourseSearch/components/CourseList/components/Courses'
import { useCourseList } from '@/modules/CourseSearch/components/CourseList/hooks'
import { Loading } from '@/modules/CourseSearch/components/Loading'

export interface CourseListProps {}

export const CourseList: React.FC<CourseListProps> = () => {
  const { courses, loading, error } = useCourseList()

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Courses loading={loading} courses={courses} />
      <Loading loading={loading} />
      {error && <Error message={error.message} />}
    </Stack>
  )
}
