export const genEdTypes = ['SO', 'HU', 'SC', 'IN', 'NO'] as const
export type GenEdType = (typeof genEdTypes)[number]

export const studyPrograms = ['S', 'T', 'I'] as const
export type StudyProgram = (typeof studyPrograms)[number]

export const semesters = ['1', '2', '3'] as const
export type Semester = (typeof semesters)[number]

export const classTypes = [
  'LECT',
  'LAB',
  'DISC',
  'FWK',
  'PRAC',
  'IDPS',
  'SMNA',
  'STU',
  'L/T',
  'IA',
  'OTHER',
  'IDVS',
  'AR',
  'CLIN',
  'TUT',
  'REFL',
]
export type ClassType = (typeof classTypes)[number]

export const dayOfWeeks = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU', 'IA', 'AR'] as const
export type DayOfWeek = (typeof dayOfWeeks)[number]

export const ModelName = {
  Course: 'course',
  Override: 'override',
  RefreshToken: 'refreshtoken',
  Review: 'review',
  User: 'user',
  ClientLogging: 'clientLogging',
} as const
