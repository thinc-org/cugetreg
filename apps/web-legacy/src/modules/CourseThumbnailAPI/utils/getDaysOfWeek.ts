import { uniq } from '@web/utils/uniq'

import { DayOfWeek } from '@cgr/codegen'
import { CourseThumbnailData, SectionThumbnailData } from '@cgr/course-utils'

const sortedDaysOfWeek: DayOfWeek[] = [
  DayOfWeek.Mo,
  DayOfWeek.Tu,
  DayOfWeek.We,
  DayOfWeek.Th,
  DayOfWeek.Fr,
  DayOfWeek.Sa,
  DayOfWeek.Su,
]

export function getDaysOfWeek(course: CourseThumbnailData): DayOfWeek[] {
  const indices = course.sections.map(daysInSection).flat()
  return uniq(indices)
    .sort()
    .map((index) => sortedDaysOfWeek[index])
}

function daysInSection(section: SectionThumbnailData) {
  const result: number[] = []
  for (const { dayOfWeek } of section.classes) {
    if (!dayOfWeek) continue
    const index = sortedDaysOfWeek.indexOf(dayOfWeek)
    if (index === -1) continue
    result.push(index)
  }
  return result
}
