import { Course } from '@thinc-org/chula-courses'

export const mockCourseData: Course[] = [
  {
    studyProgram: 'S',
    semester: '2',
    academicYear: '2564',
    courseNo: '0201122',
    abbrName: 'MGT PUB DISASTER',
    courseNameTh: 'การจัดการสาธารณภัย',
    courseNameEn: 'MANAGEMENT OF PUBLIC DISASTER',
    faculty: '02',
    department: 'ศูนย์การศึกษาทั่วไป',
    credit: 3,
    creditHours: 'LECT 3.0 CR(LECT 3.0 HR)',
    courseCondition: '-',
    courseDesc: null,
    genEdType: 'IN',
    midterm: null,
    final: null,
    sections: [
      {
        genEdType: 'IN',
        sectionNo: '1',
        closed: false,
        capacity: {
          current: 0,
          max: 80,
        },
        note: 'GENED-IN',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'TU',
            period: {
              start: '13:00',
              end: '16:00',
            },
            room: '309',
            building: 'CUP13',
            teachers: ['STAFF'],
          },
        ],
      },
    ],
  },
  {
    studyProgram: 'S',
    semester: '2',
    academicYear: '2564',
    courseNo: '0201107',
    abbrName: 'LRN STUD ACT',
    courseNameTh: 'การเรียนรู้ผ่านกิจกรรมนิสิต',
    courseNameEn: 'LEARNING THROUGH STUDENT ACTIVITIES',
    faculty: '02',
    department: 'ศูนย์การศึกษาทั่วไป',
    credit: 3,
    creditHours: 'LECT 1.0 CR + NL36 2.0 CR(LECT 1.0 HR + FWK 6.0 HR)',
    courseCondition: '-',
    courseDesc: null,
    genEdType: 'IN',
    midterm: null,
    final: null,
    sections: [
      {
        genEdType: 'IN',
        sectionNo: '1',
        closed: false,
        capacity: {
          current: 0,
          max: 30,
        },
        note: 'GENED-IN',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '13:00',
              end: '14:00',
            },
            room: '202',
            building: 'MAHIT',
            teachers: ['STAFF'],
          },
          {
            type: 'FWK',
            dayOfWeek: 'WE',
            period: {
              start: '14:00',
              end: '16:00',
            },
            room: '202',
            building: 'MAHIT',
            teachers: ['STAFF'],
          },
          {
            type: 'FWK',
            dayOfWeek: 'IA',
            period: {
              start: 'IA',
              end: 'IA',
            },
            room: null,
            building: null,
            teachers: ['STAFF'],
          },
        ],
      },
      {
        genEdType: 'IN',
        sectionNo: '2',
        closed: false,
        capacity: {
          current: 0,
          max: 30,
        },
        note: 'GENED-IN',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '13:00',
              end: '14:00',
            },
            room: '202',
            building: 'MAHIT',
            teachers: ['STAFF'],
          },
          {
            type: 'FWK',
            dayOfWeek: 'WE',
            period: {
              start: '14:00',
              end: '16:00',
            },
            room: '202',
            building: 'MAHIT',
            teachers: ['STAFF'],
          },
          {
            type: 'FWK',
            dayOfWeek: 'IA',
            period: {
              start: 'IA',
              end: 'IA',
            },
            room: null,
            building: null,
            teachers: ['STAFF'],
          },
        ],
      },
    ],
  },
  {
    studyProgram: 'S',
    semester: '2',
    academicYear: '2564',
    courseNo: '0123104',
    abbrName: 'UNIV THAI READING',
    courseNameTh: 'การอ่านภาษาไทยระดับอุดมศึกษา',
    courseNameEn: 'UNIVERSITY LEVEL OF THAI READING',
    faculty: '01',
    department: 'สถาบันภาษาไทยสิรินธร',
    credit: 3,
    creditHours: 'LECT 1.0 CR + NL23 2.0 CR(LECT 1.0 HR + PRAC 4.0 HR)',
    courseCondition: '-',
    courseDesc: null,
    genEdType: 'HU',
    midterm: {
      date: '2565-03-09T00:00:00.000Z',
      period: {
        start: '16:00',
        end: '19:00',
      },
    },
    final: {
      date: '2565-05-11T00:00:00.000Z',
      period: {
        start: '16:00',
        end: '19:00',
      },
    },
    sections: [
      {
        genEdType: 'HU',
        sectionNo: '1',
        closed: false,
        capacity: {
          current: 0,
          max: 60,
        },
        note: 'GENED-HU (E-LEARNING)',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '16:00',
              end: '17:00',
            },
            room: '201',
            building: 'MAHIT',
            teachers: ['WSN'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'WE',
            period: {
              start: '17:00',
              end: '19:00',
            },
            room: '201',
            building: 'MAHIT',
            teachers: ['WSN'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'IA',
            period: {
              start: 'IA',
              end: 'IA',
            },
            room: null,
            building: null,
            teachers: ['WSN'],
          },
        ],
      },
      {
        genEdType: 'HU',
        sectionNo: '2',
        closed: false,
        capacity: {
          current: 0,
          max: 60,
        },
        note: 'GENED-HU (E-LEARNING)',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '16:00',
              end: '17:00',
            },
            room: '202',
            building: 'MAHIT',
            teachers: ['NSP'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'WE',
            period: {
              start: '17:00',
              end: '19:00',
            },
            room: '202',
            building: 'MAHIT',
            teachers: ['NSP'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'IA',
            period: {
              start: 'IA',
              end: 'IA',
            },
            room: null,
            building: null,
            teachers: ['NSP'],
          },
        ],
      },
      {
        genEdType: 'HU',
        sectionNo: '3',
        closed: false,
        capacity: {
          current: 0,
          max: 60,
        },
        note: 'GENED-HU (E-LEARNING)',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '16:00',
              end: '17:00',
            },
            room: '401',
            building: 'MAHIT',
            teachers: ['NPR'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'WE',
            period: {
              start: '17:00',
              end: '19:00',
            },
            room: '401',
            building: 'MAHIT',
            teachers: ['NPR'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'IA',
            period: {
              start: 'IA',
              end: 'IA',
            },
            room: null,
            building: null,
            teachers: ['NPR'],
          },
        ],
      },
      {
        genEdType: 'HU',
        sectionNo: '4',
        closed: false,
        capacity: {
          current: 0,
          max: 60,
        },
        note: 'GENED-HU (E-LEARNING)',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '16:00',
              end: '17:00',
            },
            room: '402',
            building: 'MAHIT',
            teachers: ['SCW'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'WE',
            period: {
              start: '17:00',
              end: '19:00',
            },
            room: '402',
            building: 'MAHIT',
            teachers: ['SCW'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'IA',
            period: {
              start: 'IA',
              end: 'IA',
            },
            room: null,
            building: null,
            teachers: ['SCW'],
          },
        ],
      },
      {
        genEdType: 'HU',
        sectionNo: '5',
        closed: false,
        capacity: {
          current: 0,
          max: 60,
        },
        note: 'GENED-HU (E-LEARNING)',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '16:00',
              end: '17:00',
            },
            room: '412',
            building: 'MAHIT',
            teachers: ['SSN'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'WE',
            period: {
              start: '17:00',
              end: '19:00',
            },
            room: '412',
            building: 'MAHIT',
            teachers: ['SSN'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'IA',
            period: {
              start: 'IA',
              end: 'IA',
            },
            room: null,
            building: null,
            teachers: ['SSN'],
          },
        ],
      },
      {
        genEdType: 'HU',
        sectionNo: '6',
        closed: true,
        capacity: {
          current: 0,
          max: 60,
        },
        note: 'GENED-HU (E-LEARNING)',
        classes: [
          {
            type: 'LECT',
            dayOfWeek: 'WE',
            period: {
              start: '16:00',
              end: '17:00',
            },
            room: '412',
            building: 'MAHIT',
            teachers: ['WSN'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'WE',
            period: {
              start: '17:00',
              end: '19:00',
            },
            room: '412',
            building: 'MAHIT',
            teachers: ['WSN'],
          },
          {
            type: 'PRAC',
            dayOfWeek: 'IA',
            period: {
              start: 'IA',
              end: 'IA',
            },
            room: null,
            building: null,
            teachers: ['WSN'],
          },
        ],
      },
    ],
  },
]
