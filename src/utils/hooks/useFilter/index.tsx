import { QueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { SearchCourseVars } from '@/utils/network/BackendGQLQueries'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

export const useFilter = () => {
  const router = useRouter()

  const joinArray = (params: string | undefined, joiner: string[] | undefined) => {
    const paramArray = params ? params.split(',') : undefined
    if (paramArray && joiner) return [...joiner, paramArray]
    return joiner
  }

  // eslint-disable-next-line
  function removeUndefinedValue<T extends { [key: string]: any }>(obj: T): { [key: string]: any } {
    Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key])
    return obj
  }

  const setFilter = useCallback(
    (filterVars: SearchCourseVars['filter']) => {
      const currentQuery = router.query as QueryParams

      const query: QueryParams = {
        ...currentQuery,
        keyword: filterVars.keyword,
        genEdTypes: filterVars.genEdTypes?.join(','),
        dayOfWeeks: filterVars.dayOfWeeks?.join(','),
      }

      router.push({ pathname: router.pathname, query: removeUndefinedValue(query) })
    },
    [router]
  )

  return { setFilter }
}
