import { DayOfWeek } from '@cgr/codegen'

type dayOfWeekMapperType = Record<DayOfWeek, string>

export const dayOfWeekMapper: dayOfWeekMapperType = {
  MO: 'MON',
  TU: 'TUE',
  WE: 'WED',
  TH: 'THU',
  FR: 'FRI',
  SA: 'SAT',
  SU: 'SUN',
  IA: 'IA',
  AR: 'AR',
}

export const dayOfWeekArray: DayOfWeek[] = [
  DayOfWeek.Mo,
  DayOfWeek.Tu,
  DayOfWeek.We,
  DayOfWeek.Th,
  DayOfWeek.Fr,
  DayOfWeek.Sa,
  DayOfWeek.Su,
  DayOfWeek.Ia,
  DayOfWeek.Ar,
]
