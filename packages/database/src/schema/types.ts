import { pgEnum } from 'drizzle-orm/pg-core'

export const allSemesters = ['1', '2', '3'] as const
export type Semester = (typeof allSemesters)[number]
export const semester = pgEnum('semester', allSemesters)

export const allStudyPrograms = ['S', 'T', 'I'] as const
export type StudyProgram = (typeof allStudyPrograms)[number]
export const studyProgram = pgEnum('study_program', allStudyPrograms)

export const allGenEdTypes = ['NO', 'SC', 'SO', 'HU', 'IN'] as const
export type GenEdType = (typeof allGenEdTypes)[number]
export const genEdType = pgEnum('gen_ed_type', allGenEdTypes)

export const dayOfWeek = pgEnum('day_of_week', [
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
  'SU',
  'AR',
  'IA',
])
