import { Course } from '@thinc-org/chula-courses-types'

export const mockData: Course[] = [
  {
    studyProgram: 'S',
    semester: 1,
    academicYear: 2020,

    // Course info
    courseNo: '123534645',
    abbrName: 'URBAN LIVING',
    courseNameTh: 'Thai name',
    courseNameEn: 'English Name',
    faculty: 'Engineer',
    credit: 2,
    creditHours: '4',
    courseCondition: 'open',
    genEdType: 'SO', // Non GenEd is undefied

    // Exam
    midterm: undefined,
    final: undefined,

    // Section
    sections: [
      {
        sectionNo: 2,
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfweek: 'MO',
            period: {
              start: '12',
              end: '14',
            },
            building: 'ENG 3',
            room: '2',
            teacher: 'AJ',
          },
        ],
      },
    ],
  },
  {
    studyProgram: 'S',
    semester: 1,
    academicYear: 2020,

    // Course info
    courseNo: '34124',
    abbrName: 'URBAN LIVING',
    courseNameTh: 'Thai name',
    courseNameEn: 'English Name',
    faculty: 'Engineer',
    credit: 2,
    creditHours: '4',
    courseCondition: 'open',
    genEdType: 'HU', // Non GenEd is undefied

    // Exam
    midterm: undefined,
    final: undefined,

    // Section
    sections: [
      {
        sectionNo: 2,
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfweek: 'MO',
            period: {
              start: '12',
              end: '14',
            },
            building: 'ENG 3',
            room: '2',
            teacher: 'AJ',
          },
        ],
      },
    ],
  },
  {
    studyProgram: 'S',
    semester: 1,
    academicYear: 2020,

    // Course info
    courseNo: '567345',
    abbrName: 'URBAN LIVING',
    courseNameTh: 'Thai name',
    courseNameEn: 'English Name',
    faculty: 'Engineer',
    credit: 2,
    creditHours: '4',
    courseCondition: 'open',
    genEdType: 'SO', // Non GenEd is undefied

    // Exam
    midterm: undefined,
    final: undefined,

    // Section
    sections: [
      {
        sectionNo: 2,
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfweek: 'MO',
            period: {
              start: '12',
              end: '14',
            },
            building: 'ENG 3',
            room: '2',
            teacher: 'AJ',
          },
        ],
      },
    ],
  },
  {
    studyProgram: 'S',
    semester: 1,
    academicYear: 2020,

    // Course info
    courseNo: '34543',
    abbrName: 'URBAN LIVING',
    courseNameTh: 'Thai name',
    courseNameEn: 'English Name',
    faculty: 'Engineer',
    credit: 2,
    creditHours: '4',
    courseCondition: 'open',
    genEdType: undefined, // Non GenEd is undefied

    // Exam
    midterm: undefined,
    final: undefined,

    // Section
    sections: [
      {
        sectionNo: 2,
        closed: false,
        capacity: {
          current: 13,
          max: 40,
        },
        note: 'No note',
        classes: [
          {
            type: 'LECT',
            dayOfweek: 'MO',
            period: {
              start: '12',
              end: '14',
            },
            building: 'ENG 3',
            room: '2',
            teacher: 'AJ',
          },
        ],
      },
    ],
  },
]
