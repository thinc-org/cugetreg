import { Course } from '@libs/codegen'

export interface SelectButtonProps {
  course: Course
  selectedSectionNumber: string
  log: (_?: unknown, value?: string) => void
}
