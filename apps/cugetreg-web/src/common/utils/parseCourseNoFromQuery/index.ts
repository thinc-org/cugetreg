import { ParsedUrlQuery } from 'querystring'

import { parseCourseGroup } from '@web/common/utils/parseCourseGroup'

import { GetCourseInfoQueryVariables } from '@libs/codegen'

export function parseCourseNoFromQuery(q: ParsedUrlQuery): GetCourseInfoQueryVariables {
  const query = q as {
    courseNo: string
  }
  return {
    courseNo: query.courseNo,
    courseGroup: parseCourseGroup(q),
  }
}
