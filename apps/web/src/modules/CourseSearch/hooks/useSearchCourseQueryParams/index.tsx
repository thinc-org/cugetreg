import { useCallback, useMemo } from 'react'

import { useRouter } from 'next/router'

import { useCourseGroup } from '@web/common/hooks/useCourseGroup'

import { SearchCourseQueryVariables } from '@cgr/codegen'

import { QueryParams } from './types'
import { extractSearchVarsFromQuery } from './utils/extractSearchVarsFromQuery'
import { removeUndefinedValue } from './utils/removeUndefinedValue'

export const useSearchCourseQueryParams = () => {
  const router = useRouter()
  const courseGroup = useCourseGroup()

  const searchCourseQueryParams: SearchCourseQueryVariables = useMemo<SearchCourseQueryVariables>(
    () => extractSearchVarsFromQuery(router.query as QueryParams, courseGroup),
    [router.query, courseGroup]
  )

  const setFilter = useCallback(
    async (filterVars: SearchCourseQueryVariables['filter']) => {
      const currentQuery = router.query as QueryParams

      const query: QueryParams = {
        ...currentQuery,
        startTime: filterVars?.periodRange?.start,
        endTime: filterVars?.periodRange?.end,
        keyword: filterVars.keyword,
        genEdTypes: filterVars.genEdTypes?.join(','),
        dayOfWeeks: filterVars.dayOfWeeks?.join(','),
      }

      if (query.keyword === '') {
        delete query.keyword
      }

      router.push({ pathname: router.pathname, query: removeUndefinedValue(query) })
    },
    [router]
  )

  return { searchCourseQueryParams, setFilter }
}
