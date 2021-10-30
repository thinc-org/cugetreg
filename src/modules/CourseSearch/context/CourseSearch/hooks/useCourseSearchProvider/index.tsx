import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'

import { LIMIT_QUERY_CONSTANT } from '@/modules/CourseSearch/context/CourseSearch/constants'
import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/services/apollo/query/searchCourse'

import { useEmpty } from '../useEmpty'

export const useCourseSearchProvider = () => {
  const router = useRouter()
  const { isEmpty, setIsEmpty } = useEmpty()
  const [offset, setOffset] = useState(0)
  const { searchCourseQueryParams } = useSearchCourseQueryParams()

  const variables = useMemo(
    () => ({
      ...searchCourseQueryParams,
      filter: {
        ...searchCourseQueryParams.filter,
        limit: LIMIT_QUERY_CONSTANT,
        offset: 0,
      },
    }),
    [searchCourseQueryParams]
  )

  const courseSearchQuery = useQuery<SearchCourseResponse, SearchCourseVars>(SEARCH_COURSE, {
    notifyOnNetworkStatusChange: true,
    variables,
  })
  useEffect(() => {
    courseSearchQuery.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCourseQueryParams.filter.periodRange?.start, searchCourseQueryParams.filter.periodRange?.end])

  const fetchMoreCourses = async () => {
    if (!courseSearchQuery.loading && !isEmpty) {
      const result = await courseSearchQuery.fetchMore({
        variables: {
          ...searchCourseQueryParams,
          filter: {
            ...searchCourseQueryParams.filter,
            limit: LIMIT_QUERY_CONSTANT,
            offset: offset + LIMIT_QUERY_CONSTANT,
          },
        },
      })
      if (!result.data.search.length) {
        setIsEmpty(true)
      }
      setOffset(offset + LIMIT_QUERY_CONSTANT)
    }
  }

  useEffect(() => {
    setOffset(0)
    setIsEmpty(false)
    // eslint-disable-next-line
  }, [router.query, courseSearchQuery.variables])

  return { courseSearchQuery, fetchMoreCourses }
}
