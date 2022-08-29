import { StudyProgram } from '@thinc-org/chula-courses'

export interface QueryParams {
  keyword?: string
  genEdTypes?: string
  dayOfWeeks?: string
  limit?: number
  offset?: number
  semester?: string
  academicYear?: string
  studyProgram?: StudyProgram
  startTime?: string
  endTime?: string
}
