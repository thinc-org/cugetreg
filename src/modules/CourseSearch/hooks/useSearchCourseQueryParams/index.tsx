import { DayOfWeek, GenEdType, StudyProgram } from '@thinc-org/chula-courses'
import { useRouter } from 'next/router'
import { useMemo, useCallback } from 'react'

import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { CourseGroup, SearchCourseVars } from '@/utils/network/BackendGQLQueries'

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

export function extractSearchVarsFromQuery(query: QueryParams, courseGroup: CourseGroup): SearchCourseVars {
  const { keyword, genEdTypes, dayOfWeeks } = query

  const genEdTypeArray = genEdTypes ? genEdTypes.split(',') : undefined
  const dayOfWeekArray = dayOfWeeks ? dayOfWeeks.split(',') : undefined

  const filter = removeUndefinedValue({
    keyword: keyword ? keyword : undefined,
    genEdTypes: genEdTypeArray ? (genEdTypeArray as GenEdType[]) : undefined,
    dayOfWeeks: dayOfWeekArray ? (dayOfWeekArray as DayOfWeek[]) : undefined,
  })

  return { filter, courseGroup }
}

export const useSearchCourseQueryParams = () => {
  const router = useRouter()
  const courseGroup = useCourseGroup()

  const searchCourseQueryParams: SearchCourseVars = useMemo<SearchCourseVars>(
    () => extractSearchVarsFromQuery(router.query as QueryParams, courseGroup),
    [router.query, courseGroup]
  )

  const setFilter = useCallback(
    async (filterVars: SearchCourseVars['filter']) => {
      const currentQuery = router.query as QueryParams

      const query: QueryParams = {
        ...currentQuery,
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
