import { CourseThumbnailData } from '@/services/apollo/query/getCourse'

export type CapacityStatus = 'available' | 'full' | 'closed'

export interface CapacityInfo {
  current: number
  max: number
  closed: boolean
  status: CapacityStatus
}

export function getCapacityInfo(course: CourseThumbnailData): CapacityInfo {
  const current = course.sections.reduce((acc, cur) => acc + cur.capacity.current, 0)
  const max = course.sections.reduce((acc, cur) => acc + cur.capacity.max, 0)
  const closed = course.sections.every((section) => section.closed)
  const status = closed ? 'closed' : current >= max ? 'full' : 'available'
  return { current, max, closed, status }
}
