import { StudyProgram } from '@cugetreg/codegen'

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
