import { Course } from '@thinc-org/chula-courses'

export interface SelectButtonProps {
  course: Course
  selectedSectionNumber: string
  log: (_?: unknown, value?: string) => void
}
