import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'

import { SearchCourseVars } from '@/utils/network/BackendGQLQueries'
import { DayOfWeek, GenEdType, StudyProgram } from '@thinc-org/chula-courses'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'

export interface QueryParams {
  keyword?: string
  genEdTypes?: string
  dayOfWeeks?: string
  limit?: number
  offset?: number
  semester?: string
  academicYear?: string
  studyProgram?: StudyProgram
}

// eslint-disable-next-line
function removeUndefinedValue<T extends { [key: string]: any }>(obj: T): { [key: string]: any } {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key])
  return obj
}

export const useSearchCourseQueryParams = () => {
  const router = useRouter()
  const courseGroup = useCourseGroup()

  const searchCourseQueryParams: SearchCourseVars = useMemo<SearchCourseVars>(() => {
    const { keyword, genEdTypes, dayOfWeeks } = router.query as QueryParams

    const genEdTypeArray = genEdTypes ? genEdTypes.split(',') : undefined
    const dayOfWeekArray = dayOfWeeks ? dayOfWeeks.split(',') : undefined

    const filter = removeUndefinedValue({
      keyword: keyword ? keyword : undefined,
      genEdTypes: genEdTypeArray ? (genEdTypeArray as GenEdType[]) : undefined,
      dayOfWeeks: dayOfWeekArray ? (dayOfWeekArray as DayOfWeek[]) : undefined,
    })

    return { filter, courseGroup }
  }, [router.query, courseGroup])

  const setFilter = useCallback(
    async (filterVars: SearchCourseVars['filter']) => {
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

  return { searchCourseQueryParams, setFilter }
}
