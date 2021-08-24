import { ParsedUrlQuery } from 'querystring'

import { parseCourseGroup } from '@/utils/courseGroup'
import { GetCourseVars } from '@/utils/network/BackendGQLQueries'

export function parseVariablesFromQuery(q: ParsedUrlQuery): GetCourseVars {
  const query = q as {
    courseNo: string
  }
  return {
    courseNo: query.courseNo,
    courseGroup: parseCourseGroup(q),
  }
}
