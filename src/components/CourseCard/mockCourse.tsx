import { Course } from '@thinc-org/chula-courses'

export const mockNoGenEdCourse: Course = {
  studyProgram: 'T',
  department: 'ไม่สังกัดภาควิชา/เทียบเท่า',
  semester: '2',
  academicYear: '2021',
  courseNo: '2110327',
  abbrName: 'ALGORITHM DESIGN',
  courseNameTh: 'ALGORITHM DESIGN',
  courseNameEn: 'ALGORITHM DESIGN',
  faculty: 'Engineer',
  credit: 3,
  creditHours: '3',
  genEdType: 'NO',
  courseCondition: 'PRER 2110200,2110211',
  midterm: {
    date: new Date('2020-09-21T06:06:27.182Z'),
    period: {
      start: '8:00',
      end: '11:00',
    },
  },
  final: {
    date: new Date('2021-07-06T03:27:38.501Z'),
    period: {
      start: '13:00',
      end: '16:00',
    },
  },
  sections: [
    {
      sectionNo: '1',
      closed: false,
      capacity: {
        current: 70,
        max: 100,
      },
      note: '-',
      classes: [
        {
          type: 'LECT',
          dayOfWeek: 'WE',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '303',
          teachers: ['ATW'],
        },
        {
          type: 'LECT',
          dayOfWeek: 'TH',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '303',
          teachers: ['ATW'],
        },
      ],
    },
    {
      sectionNo: '2',
      closed: false,
      capacity: {
        current: 99,
        max: 99,
      },
      note: '-',
      classes: [
        {
          type: 'LECT',
          dayOfWeek: 'TU',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: 'AR',
          teachers: ['NNN'],
        },
      ],
    },
    {
      sectionNo: '33',
      closed: true,
      capacity: {
        current: 50,
        max: 68,
      },
      note: '-',
      classes: [
        {
          type: 'LECT',
          dayOfWeek: 'TH',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '101',
          teachers: ['ATS'],
        },
      ],
    },
  ],
}

export const mockGenEdCourse: Course = {
  studyProgram: 'T',
  department: 'ไม่สังกัดภาควิชา/เทียบเท่า',
  semester: '2',
  academicYear: '2021',
  courseNo: '2110327',
  abbrName: 'ALGORITHM DESIGN',
  courseNameTh: 'ALGORITHM DESIGN',
  courseNameEn: 'ALGORITHM DESIGN',
  faculty: 'Engineer',
  credit: 3,
  creditHours: '3',
  genEdType: 'SC',
  courseCondition: 'PRER 2110200,2110211',
  midterm: {
    date: new Date('2020-09-21T06:06:27.182Z'),
    period: {
      start: '8:00',
      end: '11:00',
    },
  },
  final: {
    date: new Date('2021-07-06T03:27:38.501Z'),
    period: {
      start: '13:00',
      end: '16:00',
    },
  },
  sections: [
    {
      sectionNo: '1',
      closed: false,
      capacity: {
        current: 70,
        max: 100,
      },
      note: '-',
      classes: [
        {
          type: 'LECT',
          dayOfWeek: 'MO',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '101',
          teachers: ['ATS'],
        },
        {
          type: 'LECT',
          dayOfWeek: 'WE',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '101',
          teachers: ['ATS'],
        },
      ],
    },
    {
      sectionNo: '2',
      closed: false,
      capacity: {
        current: 99,
        max: 99,
      },
      note: '-',
      classes: [
        {
          type: 'LECT',
          dayOfWeek: 'MO',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '101',
          teachers: ['ATS'],
        },
        {
          type: 'LECT',
          dayOfWeek: 'WE',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '101',
          teachers: ['ATS'],
        },
      ],
    },
    {
      sectionNo: '33',
      closed: true,
      capacity: {
        current: 50,
        max: 68,
      },
      note: '-',
      classes: [
        {
          type: 'LECT',
          dayOfWeek: 'MO',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '101',
          teachers: ['ATS'],
        },
        {
          type: 'LECT',
          dayOfWeek: 'WE',
          period: {
            start: '9:30',
            end: '11:00',
          },
          building: 'ENG3',
          room: '101',
          teachers: ['ATS'],
        },
      ],
    },
  ],
}
