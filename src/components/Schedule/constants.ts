import { DayOfWeek } from '@thinc-org/chula-courses'

export const hourStart = 8
export const hourEnd = 19

export const days: DayOfWeek[] = ['MO', 'TU', 'WE', 'TH', 'FR']

export const colsCount = hourEnd - hourStart + 2
export const rowsCount = days.length + 1

export const strokeSize = 1
