import { useSearchCourseQuery } from '@cugetreg/codegen'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { LIMIT_QUERY_CONSTANT } from '@web/modules/CourseSearch/context/CourseSearch/constants'
import { useSearchCourseQueryParams } from '@web/modules/CourseSearch/hooks/useSearchCourseQueryParams'

import { useEmpty } from '../useEmpty'

export const useCourseSearchProvider = () => {
  const router = useRouter()
  const { isEmpty, setIsEmpty } = useEmpty()
  const [offset, setOffset] = useState(0)
  const { searchCourseQueryParams } = useSearchCourseQueryParams()

  const courseSearchQuery = useSearchCourseQuery({
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

  return { courseSearchQuery, fetchMoreCourses }
}
