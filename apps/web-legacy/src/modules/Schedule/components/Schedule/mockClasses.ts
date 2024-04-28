import { mockCourseData } from '@web/__mock__/courses'
import { mockItem } from '@web/__mock__/overlap'

import { DayOfWeek, GenEdType, StudyProgram } from '@cgr/codegen'

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
  studyProgram: StudyProgram.S,
  dayOfWeek: DayOfWeek.Mo,
  genEdType: GenEdType.Hu,
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
    dayOfWeek: DayOfWeek.Mo,
    genEdType: GenEdType.Hu,
    period: {
      start: '8:30',
      end: '11:30',
    },
  },
  {
    ...courseTemplate,
    classIndex: 1,
    dayOfWeek: DayOfWeek.Mo,
    genEdType: GenEdType.No,
    period: {
      start: '12:30',
      end: '14:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 2,
    dayOfWeek: DayOfWeek.Mo,
    genEdType: GenEdType.No,
    period: {
      start: '14:00',
      end: '15:30',
    },
  },
  {
    ...courseTemplate,
    classIndex: 2,
    dayOfWeek: DayOfWeek.Tu,
    genEdType: GenEdType.Sc,
    period: {
      start: '8:00',
      end: '9:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 3,
    dayOfWeek: DayOfWeek.We,
    genEdType: GenEdType.No,
    period: {
      start: '8:00',
      end: '11:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 4,
    dayOfWeek: DayOfWeek.We,
    genEdType: GenEdType.No,
    period: {
      start: '11:30',
      end: '14:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 5,
    dayOfWeek: DayOfWeek.We,
    genEdType: GenEdType.No,
    period: {
      start: '13:30',
      end: '16:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 6,
    dayOfWeek: DayOfWeek.Th,
    genEdType: GenEdType.No,
    period: {
      start: '12:00',
      end: '15:00',
    },
  },
  {
    ...courseTemplate,
    classIndex: 7,
    dayOfWeek: DayOfWeek.Fr,
    genEdType: GenEdType.So,
    period: {
      start: '8:00',
      end: '10:30',
    },
  },
  {
    ...courseTemplate,
    classIndex: 8,
    dayOfWeek: DayOfWeek.Fr,
    genEdType: GenEdType.In,
    period: {
      start: '11:00',
      end: '15:00',
    },
  },
]
