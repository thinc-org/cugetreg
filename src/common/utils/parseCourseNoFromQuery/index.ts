import { ParsedUrlQuery } from 'querystring'

import { parseCourseGroup } from '@/common/utils/parseCourseGroup'
import { GetCourseVars } from '@/services/apollo/query/getCourse'

export function parseCourseNoFromQuery(q: ParsedUrlQuery): GetCourseVars {
  const query = q as {
    courseNo: string
  }
  return {
    courseNo: query.courseNo,
    courseGroup: parseCourseGroup(q),
  }
}
