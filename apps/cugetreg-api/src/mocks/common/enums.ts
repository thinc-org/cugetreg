import { ClassType, DayOfWeekEnum, GenEdTypeEnum, StudyProgramEnum } from '@thinc-org/chula-courses'

export const genEdTypes = [
  GenEdTypeEnum.IN,
  GenEdTypeEnum.HU,
  GenEdTypeEnum.NO,
  GenEdTypeEnum.SC,
  GenEdTypeEnum.SO,
]

export const studyPrograms = [
  StudyProgramEnum.Semester,
  StudyProgramEnum.Trisemter,
  StudyProgramEnum.International,
]

export const dayOfWeeks = [
  DayOfWeekEnum.Monday,
  DayOfWeekEnum.Tuesday,
  DayOfWeekEnum.Wednesday,
  DayOfWeekEnum.Thursday,
  DayOfWeekEnum.Friday,
  DayOfWeekEnum.Saturday,
  DayOfWeekEnum.Sunday,
  DayOfWeekEnum.AR,
  DayOfWeekEnum.IA,
]

export const classTypes: ClassType[] = [
  'AR',
  'CLIN',
  'DISC',
  'FWK',
  'IA',
  'IDPS',
  'IDVS',
  'L/T',
  'LAB',
  'LECT',
  'OTHER',
  'PRAC',
  'REFL',
  'SMNA',
  'STU',
  'TUT',
]
