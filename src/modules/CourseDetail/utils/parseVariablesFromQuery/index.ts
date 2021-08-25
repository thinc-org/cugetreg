import { ParsedUrlQuery } from 'querystring'

import { GetCourseVars } from '@/services/apollo/query'
import { parseCourseGroup } from '@/utils/courseGroup'

export function parseVariablesFromQuery(q: ParsedUrlQuery): GetCourseVars {
  const query = q as {
    courseNo: string
  }
  return {
    courseNo: query.courseNo,
    courseGroup: parseCourseGroup(q),
  }
}
