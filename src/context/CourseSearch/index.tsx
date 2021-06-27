import React, { createContext, useMemo, useState, useEffect } from 'react'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { DEFAULT_COURSE_SEARCH_CONTEXT_VALUE, LIMIT_QUERY_CONSTANT } from '@/context/CourseSearch/constants'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

export const CourseSearchContext = createContext(DEFAULT_COURSE_SEARCH_CONTEXT_VALUE)

export const CourseSearchProvider: React.FC = (props) => {
  const router = useRouter()
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
      },
    },
  })

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

  useEffect(() => {
    const refetcher = async () => {
      await courseSearchQuery.refetch({
        ...searchCourseQueryParams,
        filter: {
          ...searchCourseQueryParams.filter,
          limit: LIMIT_QUERY_CONSTANT,
          offset: 0,
        },
      })
      setOffset(0)
    }

    refetcher()
  }, [router])

  const value = { courseSearchQuery, fetchMoreCourses, pageIndex }

  return <CourseSearchContext.Provider value={value} {...props} />
}
