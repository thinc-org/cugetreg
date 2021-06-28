import React, { createContext, useState, useEffect } from 'react'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { DEFAULT_COURSE_SEARCH_CONTEXT_VALUE, LIMIT_QUERY_CONSTANT } from '@/context/CourseSearch/constants'
import { useApolloClient, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { SearchPagePrefetchData } from '@/pages/[studyProgram]/courses'

export const CourseSearchContext = createContext(DEFAULT_COURSE_SEARCH_CONTEXT_VALUE)

export const CourseSearchProvider: React.FC<{ cache?: SearchPagePrefetchData }> = (props) => {
  const router = useRouter()
  const [offset, setOffset] = useState(0)

  const { searchCourseQueryParams } = useSearchCourseQueryParams()

  const [cacheInjected, setCacheInjected] = useState(false)
  const client = useApolloClient()
  const cache: SearchPagePrefetchData | undefined = props.cache

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
    setOffset(0)
    // eslint-disable-next-line
  }, [router.query, courseSearchQuery.variables])

  const value = { courseSearchQuery, fetchMoreCourses }

  return <CourseSearchContext.Provider value={value} {...props} />
}
