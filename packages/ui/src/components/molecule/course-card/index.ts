export { default as CourseCard } from './course-card.svelte'
import type { Day } from '../../atom/day-chip/index.js'
import type { Type } from '../../atom/gened-chip/index.js'

type Course = {
  code: string
  name: string
  credit: number
  gened: Type[]
  seat: number
  maxseat: number
  review: number
  days: Day[]
}

export type { Course }
