export { default as CourseCard } from './course-card.svelte'
import type { Day } from '../day-chip'
import type { Type } from '../gened-chip'

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
