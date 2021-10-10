import { Course } from '@thinc-org/chula-courses'
import { uniq } from 'lodash'

export function courseTypeStringFromCourse(course: Course) {
  const { sections } = course
  const classTypes = sections.flatMap((section) => section.classes.map((course) => course.type))
  const uniqueClassTypes = uniq(classTypes)
  return uniqueClassTypes.join('/')
}
