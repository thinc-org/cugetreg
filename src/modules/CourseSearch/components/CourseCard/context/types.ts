import { Course, DayOfWeek, Capacity, Section } from '@thinc-org/chula-courses'

export interface CourseCardContextValue {
  course: Course
  isGenEd: boolean
  classDays: DayOfWeek[]
  courseCapacity: Capacity
  sectionNumbers: string[]
  selectedSectionNumber: string
  setSectionNumber: (sectionNo: string) => void
  selectedSection: Section
  teachers: string[]
  isExpanded: boolean
  onToggle: () => void
}
