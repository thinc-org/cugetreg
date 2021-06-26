import React, { createContext, useMemo, useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { DEFAULT_COURSE_SEARCH_CONTEXT_VALUE, LIMIT_QUERY_CONSTANT } from '@/context/CourseSearch/constants'

export const CourseSearchContext = createContext(DEFAULT_COURSE_SEARCH_CONTEXT_VALUE)

export const CourseSearchProvider: React.FC = (props) => {
  const [offset, setOffset] = useState(0)
  const pageIndex = useMemo(() => offset / LIMIT_QUERY_CONSTANT, [offset])

  const { searchCourseQueryParams } = useSearchCourseQueryParams()

  const courseSearchQuery = useQuery<SearchCourseResponse, SearchCourseVars>(SEARCH_COURSE, {
    notifyOnNetworkStatusChange: true,
    variables: {
      courseGroup: searchCourseQueryParams.courseGroup,
      filter: {
        dayOfWeeks: searchCourseQueryParams.filter.dayOfWeeks,
        limit: LIMIT_QUERY_CONSTANT,
        offset: offset,
      },
    },
  })

  useEffect(() => {}, [courseSearchQuery, searchCourseQueryParams.filter.dayOfWeeks])

  const fetchMoreCourses = async () => {
    if (!courseSearchQuery.loading) {
      await courseSearchQuery.fetchMore({
        variables: {
          ...searchCourseQueryParams,
          filter: {
            ...searchCourseQueryParams.filter,
            limit: LIMIT_QUERY_CONSTANT,
            offset: offset + LIMIT_QUERY_CONSTANT,
          },
        },
      })
      setOffset(offset + LIMIT_QUERY_CONSTANT)
    }
  }

  const resetOffset = () => {
    setOffset(0)
  }

  const value = { courseSearchQuery, fetchMoreCourses, resetOffset, pageIndex }

  return <CourseSearchContext.Provider value={value} {...props} />
}
