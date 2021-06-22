import { DayOfWeek } from '@thinc-org/chula-courses'

type dayOfWeekMapperType = Record<DayOfWeek, string>

export const dayOfWeekMapper: dayOfWeekMapperType = {
  MO: 'MON',
  TU: 'TUE',
  WE: 'WED',
  TH: 'THU',
  FR: 'FRI',
  SA: 'SAT',
  SU: 'SUM',
  IA: 'IA',
  AR: 'AR',
}

export const dayOfWeekArray: DayOfWeek[] = ['MO', 'TU', 'WE', 'WE', 'TH', 'FR', 'SA', 'SU', 'IA', 'AR']
