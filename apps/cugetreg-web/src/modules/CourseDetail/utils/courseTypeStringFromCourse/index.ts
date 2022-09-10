import { Course } from '@cugetreg/codegen'

import { uniq } from '@web/utils/uniq'

export function courseTypeStringFromCourse(course: Course) {
  const { sections } = course
  const classTypes = sections.flatMap((section) => section.classes.map((course) => course.type))
  const uniqueClassTypes = uniq(classTypes)
  return uniqueClassTypes.join('/')
}
