import { Capacity, Course, DayOfWeek, Section } from '@libs/codegen'

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
