import { Course } from '@thinc-org/chula-courses'
import { uniq } from 'lodash'
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

export function courseTypeStringFromCourse(course: Course) {
  const { sections } = course
  const classTypes = sections.flatMap((section) => section.classes.map((course) => course.type))
  const uniqueClassTypes = uniq(classTypes)
  return uniqueClassTypes.join('/')
}
