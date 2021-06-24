import React, { createContext, useState } from 'react'
import { CourseSearchProps } from '@/context/CourseSearch/types'
import { useQuery } from '@apollo/client'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { LIMIT_QUERY_CONSTANT } from '@/context/CourseSearch/constants'

export const CourseSearchContext = createContext({} as CourseSearchProps)

export const CourseSearchProvider: React.FC = (props) => {
  const [offset, setOffset] = useState(0)
  const { searchCourseQueryParams } = useSearchCourseQueryParams()

  const courseSearchQuery = useQuery<SearchCourseResponse, SearchCourseVars>(SEARCH_COURSE, {
    variables: {
      ...searchCourseQueryParams,
      filter: {
        ...searchCourseQueryParams.filter,
        limit: LIMIT_QUERY_CONSTANT,
        offset: offset,
      },
    },
  })

  const value = { offset, setOffset, courseSearchQuery }

  return <CourseSearchContext.Provider value={value} {...props} />
}
