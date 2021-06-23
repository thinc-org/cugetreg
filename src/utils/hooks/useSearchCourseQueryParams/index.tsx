import { useMemo } from 'react'
import { useRouter } from 'next/router'

import { DEFAULT_STUDY_PROGRAM } from '@/constants/studyProgram'
import { SearchCourseVars } from '@/utils/network/BackendGQLQueries'
import { DayOfWeek, GenEdType, StudyProgram } from '@thinc-org/chula-courses'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'
import { LIMIT_QUERY_CONSTANT } from '@/context/CourseSearch/constants'

const CURRENT_COURSE_GROUP = {
  semester: '1',
  academicYear: '2564',
  studyProgram: DEFAULT_STUDY_PROGRAM,
}

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

export const useSearchCourseQueryParams = (): SearchCourseVars => {
  const router = useRouter()
  const courseGroup = useCourseGroup()

  const searchQueryParams: SearchCourseVars = useMemo<SearchCourseVars>(() => {
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

  return searchQueryParams
}
