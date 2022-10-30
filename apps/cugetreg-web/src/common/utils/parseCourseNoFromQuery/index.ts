import { ParsedUrlQuery } from 'querystring'

import { GetCourseInfoQueryVariables } from '@cugetreg/codegen'

import { parseCourseGroup } from '@web/common/utils/parseCourseGroup'

export function parseCourseNoFromQuery(q: ParsedUrlQuery): GetCourseInfoQueryVariables {
  const query = q as {
    courseNo: string
  }
  return {
    courseNo: query.courseNo,
    courseGroup: parseCourseGroup(q),
  }
}
