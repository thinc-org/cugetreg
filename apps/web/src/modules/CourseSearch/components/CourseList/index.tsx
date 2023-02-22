import React from 'react'

import { Stack } from '@mui/material'
import { Error } from '@web/common/components/Error'
import { Loading } from '@web/modules/CourseSearch/components/Loading'

import { Courses } from './components/Courses'
import { useCourseList } from './hooks'

export const CourseList: React.FC = () => {
  const { courses, loading, error } = useCourseList()

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Courses loading={loading} courses={courses} />
      <Loading loading={loading} />
      {error && <Error message={error.message} />}
    </Stack>
  )
}
