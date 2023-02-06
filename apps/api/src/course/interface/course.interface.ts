import { Course, DayOfWeek, GenEdType, Period } from '@thinc-org/chula-courses'

export interface ICourseSearchDocument {
  abbrName: string
  courseNo: string
  courseNameTh: string
  courseNameEn: string
  courseDescTh: string
  courseDescEn: string
  genEdType: string
  studyProgram: string
  semester: string
  academicYear: string
  rawData: Course
}

export interface ICourseSearchFilter {
  keyword: string
  genEdTypes: GenEdType[]
  dayOfWeeks: DayOfWeek[]
  periodRange: Period
  limit: number
  offset: number
  studyProgram: string
  semester: string
  academicYear: string
}
