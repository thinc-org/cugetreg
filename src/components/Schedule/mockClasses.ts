import { TimetableClass } from './utils'

const courseTemplate = {
  courseNo: '2110316',
  abbrName: 'PROG LANG PRIN',
  building: 'ENG3',
  room: '318',
  teacher: 'NNN',
}

export const mockClasses: TimetableClass[] = [
  {
    ...courseTemplate,
    dayOfWeek: 'MO',
    genEdType: 'HU',
    period: {
      start: '8:30',
      end: '11:30',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'MO',
    period: {
      start: '12:30',
      end: '14:00',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'MO',
    period: {
      start: '14:00',
      end: '15:30',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'TU',
    genEdType: 'SC',
    period: {
      start: '8:00',
      end: '9:00',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'WE',
    period: {
      start: '8:00',
      end: '11:00',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'WE',
    period: {
      start: '11:30',
      end: '14:00',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'WE',
    period: {
      start: '13:30',
      end: '16:00',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'TH',
    period: {
      start: '12:00',
      end: '15:00',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'FR',
    genEdType: 'SO',
    period: {
      start: '8:00',
      end: '10:30',
    },
  },
  {
    ...courseTemplate,
    dayOfWeek: 'FR',
    genEdType: 'IN',
    period: {
      start: '11:00',
      end: '15:00',
    },
  },
]
