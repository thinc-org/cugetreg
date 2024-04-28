import { StudyProgram } from '@cgr/codegen'

export interface QueryParams {
  keyword?: string | null
  genEdTypes?: string
  gradingTypes?: string
  dayOfWeeks?: string
  limit?: number
  offset?: number
  semester?: string
  academicYear?: string
  studyProgram?: StudyProgram
  startTime?: string
  endTime?: string
}
