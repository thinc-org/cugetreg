import type { Course as RawCourse } from '@thinc-org/chula-courses'

export type Course = RawCourse & {
  rating?: string
}
