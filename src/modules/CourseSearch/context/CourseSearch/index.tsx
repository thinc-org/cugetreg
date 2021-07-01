import React, { createContext, useState, useEffect } from 'react'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'
import {
  DEFAULT_COURSE_SEARCH_CONTEXT_VALUE,
  LIMIT_QUERY_CONSTANT,
} from '@/modules/CourseSearch/context/CourseSearch/constants'
import { useApolloClient, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { CourseSearchPagePrefetchData } from '@/modules/CourseSearch/types'

export const CourseSearchContext = createContext(DEFAULT_COURSE_SEARCH_CONTEXT_VALUE)

export const CourseSearchProvider: React.FC<{ cache?: CourseSearchPagePrefetchData }> = (props) => {
  const router = useRouter()
  const [isEmpty, setIsEmpty] = useState(false)
  const [offset, setOffset] = useState(0)

  const { searchCourseQueryParams } = useSearchCourseQueryParams()

  const [cacheInjected, setCacheInjected] = useState(false)
  const client = useApolloClient()
  const cache: CourseSearchPagePrefetchData | undefined = props.cache

  if (!cacheInjected && cache) {
    client.writeQuery({
      query: SEARCH_COURSE,
      data: cache.data,
      variables: cache.vars,
    })
    setCacheInjected(true)
  }

  const courseSearchQuery = useQuery<SearchCourseResponse, SearchCourseVars>(SEARCH_COURSE, {
    notifyOnNetworkStatusChange: true,
    variables: {
      ...searchCourseQueryParams,
      filter: {
        ...searchCourseQueryParams.filter,
        limit: LIMIT_QUERY_CONSTANT,
        offset: 0,
      },
    },
  })

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

  const value = { courseSearchQuery, fetchMoreCourses }

  return <CourseSearchContext.Provider value={value} {...props} />
}
