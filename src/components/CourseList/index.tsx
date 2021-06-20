import React from 'react'

import usePeriod from '@/utils/hooks/usePeriod'
import useStudyPromgram from '@/utils/hooks/useStudyProgram'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { Stack } from '@material-ui/core'
import { useQuery } from '@apollo/client'
import { CourseCard } from '@/components/CourseCard'

export interface CourseListProps {
  searchQuery: string
}

export const CourseList: React.FC<CourseListProps> = ({ searchQuery }) => {
  const { studyProgram } = useStudyPromgram()
  const { period } = usePeriod()
  const { data, loading, error } = useQuery<SearchCourseResponse, SearchCourseVars>(SEARCH_COURSE, {
    variables: {
      courseGroup: {
        studyProgram: studyProgram,
        academicYear: period.year,
        semester: period.sem,
      },
      filter: {
        keyword: searchQuery,
      },
    },
  })

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
    <Stack spacing={2}>
      {data.search.map((result) => (
        <CourseCard key={result.courseNo} course={result} />
      ))}
    </Stack>
  )
}
