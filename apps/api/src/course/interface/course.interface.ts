import { SearchSuggest } from '@elastic/elasticsearch/lib/api/types'
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
  studyProgram: string
  semester: string
  academicYear: string
}

export interface ICourseSuggest {
  name: SearchSuggest<string>[]
  no: SearchSuggest<string>[]
}
