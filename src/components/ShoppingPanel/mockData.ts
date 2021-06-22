import { Course } from '@thinc-org/chula-courses'

export const mockData: Course[] = [
  {
    studyProgram: 'S',
    semester: '1',
    academicYear: '2020',

    // Course info
    courseNo: '123534645',
    abbrName: 'URBAN LIVING',
    courseNameTh: 'Thai name',
    courseNameEn: 'English Name',
    faculty: '21',
    department: '-',
    credit: 2,
    creditHours: '4',
    courseCondition: 'open',
    genEdType: 'SO', // Non GenEd is undefied

    // Exam
    midterm: { date: new Date(Date.now() - 3600 * 1000 * 24), period: { start: '10:20', end: '13:00' } },
    final: undefined,

    // Section
    sections: [
      {
        sectionNo: '2',
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'MO',
            period: {
              start: '12',
              end: '14',
            },
            building: 'ENG 3',
            room: '2',
            teachers: ['AJ'],
          },
        ],
      },
      {
        sectionNo: '3',
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'TU',
            period: {
              start: '13',
              end: '15',
            },
            building: 'ENG 3',
            room: '2',
            teachers: ['AJ'],
          },
        ],
      },
    ],
  },
  {
    studyProgram: 'S',
    semester: '1',
    academicYear: '2020',

    // Course info
    courseNo: '34124',
    abbrName: 'URBAN LIVING',
    courseNameTh: 'Thai name',
    courseNameEn: 'English Name',
    faculty: '21',
    department: '-',
    credit: 2,
    creditHours: '4',
    courseCondition: 'open',
    genEdType: 'HU', // Non GenEd is undefied

    // Exam
    midterm: { date: new Date(), period: { start: '11:20', end: '12:30' } },
    final: undefined,

    // Section
    sections: [
      {
        sectionNo: '2',
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'TU',
            period: {
              start: '12',
              end: '14',
            },
            building: 'ENG 3',
            room: '2',
            teachers: ['AJ'],
          },
        ],
      },
    ],
  },
  {
    studyProgram: 'S',
    semester: '1',
    academicYear: '2020',

    // Course info
    courseNo: '567345',
    abbrName: 'URBAN LIVING',
    courseNameTh: 'Thai name',
    courseNameEn: 'English Name',
    faculty: '21',
    department: '-',
    credit: 2,
    creditHours: '4',
    courseCondition: 'open',
    genEdType: 'SO', // Non GenEd is undefied

    // Exam
    midterm: { date: new Date(), period: { start: '10:30', end: '13:00' } },
    final: undefined,

    // Section
    sections: [
      {
        sectionNo: '2',
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '12',
              end: '14',
            },
            building: 'ENG 3',
            room: '2',
            teachers: ['AJ'],
          },
        ],
      },
    ],
  },
  {
    studyProgram: 'S',
    semester: '1',
    academicYear: '2020',

    // Course info
    courseNo: '34543',
    abbrName: 'URBAN LIVING',
    courseNameTh: 'Thai name',
    courseNameEn: 'English Name',
    faculty: '21',
    department: '-',
    credit: 2,
    creditHours: '4',
    courseCondition: 'open',
    genEdType: 'NO',

    // Exam
    midterm: undefined,
    final: undefined,

    // Section
    sections: [
      {
        sectionNo: '2',
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'TH',
            period: {
              start: '12',
              end: '14',
            },
            building: 'ENG 3',
            room: '2',
            teachers: ['AJ'],
          },
        ],
      },
    ],
  },
]
