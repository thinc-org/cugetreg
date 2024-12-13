import { pgEnum } from 'drizzle-orm/pg-core'

export const semester = pgEnum('semester', ['1', '2', '3'])
export const studyProgram = pgEnum('study_program', ['S', 'T', 'I'])
export const genEdType = pgEnum('gen_ed_type', ['NO', 'SC', 'SO', 'HU', 'IN'])

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
