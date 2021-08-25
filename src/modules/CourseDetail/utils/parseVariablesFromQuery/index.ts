import { ParsedUrlQuery } from 'querystring'

import { parseCourseGroup } from '@/common/hooks/useCourseGroup/utils/parseCourseGroup'
import { GetCourseVars } from '@/services/apollo/query/getCourse'

export function parseVariablesFromQuery(q: ParsedUrlQuery): GetCourseVars {
  const query = q as {
    courseNo: string
  }
  return {
    courseNo: query.courseNo,
    courseGroup: parseCourseGroup(q),
  }
}
