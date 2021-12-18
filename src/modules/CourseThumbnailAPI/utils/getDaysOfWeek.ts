import { DayOfWeek } from '@thinc-org/chula-courses'

import { CourseThumbnailData, SectionThumbnailData } from '@/services/apollo/query/getCourse'
import { uniq } from '@/utils/uniq'

const sortedDaysOfWeek: DayOfWeek[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

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
