import { CourseGroup } from '@web/common/hooks/useCourseGroup/types'

import { DayOfWeek, GenEdType, SearchCourseQueryVariables } from '@libs/codegen'

import { QueryParams } from '../../types'
import { removeUndefinedValue } from '../removeUndefinedValue'

export function extractSearchVarsFromQuery(
  query: QueryParams,
  courseGroup: CourseGroup
): SearchCourseQueryVariables {
  const { keyword, genEdTypes, dayOfWeeks, startTime, endTime } = query

  const genEdTypeArray = genEdTypes ? genEdTypes.split(',') : undefined
  const dayOfWeekArray = dayOfWeeks ? dayOfWeeks.split(',') : undefined

  const filter = removeUndefinedValue({
    keyword: keyword ? keyword : undefined,
    genEdTypes: genEdTypeArray ? (genEdTypeArray as GenEdType[]) : undefined,
    dayOfWeeks: dayOfWeekArray ? (dayOfWeekArray as DayOfWeek[]) : undefined,
    periodRange:
      startTime && endTime
        ? {
            start: startTime,
            end: endTime,
          }
        : undefined,
  })

  return { filter, courseGroup }
}
