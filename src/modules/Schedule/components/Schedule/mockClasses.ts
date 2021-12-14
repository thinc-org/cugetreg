import { mockCourseData } from '@/__mock__/courses'
import { mockItem } from '@/__mock__/overlap'

import { TimetableClass } from './utils'

const courseTemplate: TimetableClass = {
  classIndex: 0,
  courseNo: '2110316',
  abbrName: 'PROG LANG PRIN',
  building: 'ENG3',
  room: '318',
  teachers: ['NNN'],
  sectionNo: '1',
  academicYear: 'S',
  color: 'pink',
  semester: '1',
  studyProgram: 'S',
  dayOfWeek: 'MO',
  genEdType: 'HU',
  period: {
    start: '8:30',
    end: '11:30',
  },
  item: mockItem,
  section: mockCourseData[0].sections[0],
}

export const mockClasses: TimetableClass[] = [
  {
    ...courseTemplate,
    classIndex: 0,
    dayOfWeek: 'MO',
    genEdType: 'HU',
    period: {
      start: '8:30',
      end: '11:30',
    },
  },
  {
    ...courseTemplate,
    classIndex: 1,
    dayOfWeek: 'MO',
    genEdType: 'NO',
    period: {
      start: '12:30',
      end: '14:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 2,
    dayOfWeek: 'MO',
    genEdType: 'NO',
    period: {
      start: '14:00',
      end: '15:30',
    },
  },
  {
    ...courseTemplate,
    classIndex: 2,
    dayOfWeek: 'TU',
    genEdType: 'SC',
    period: {
      start: '8:00',
      end: '9:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 3,
    dayOfWeek: 'WE',
    genEdType: 'NO',
    period: {
      start: '8:00',
      end: '11:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 4,
    dayOfWeek: 'WE',
    genEdType: 'NO',
    period: {
      start: '11:30',
      end: '14:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 5,
    dayOfWeek: 'WE',
    genEdType: 'NO',
    period: {
      start: '13:30',
      end: '16:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 6,
    dayOfWeek: 'TH',
    genEdType: 'NO',
    period: {
      start: '12:00',
      end: '15:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 7,
    dayOfWeek: 'FR',
    genEdType: 'SO',
    period: {
      start: '8:00',
      end: '10:30',
    },
  },
  {
    ...courseTemplate,
    classIndex: 8,
    dayOfWeek: 'FR',
    genEdType: 'IN',
    period: {
      start: '11:00',
      end: '15:00',
    },
  },
]
