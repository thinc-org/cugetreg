import { ExamClass } from '@/common/utils/types'

import { CourseOverlap, CourseOverlapMap, ScheduleClass } from '..'

const courseTemplate: ScheduleClass = {
  courseNo: '2110316',
  abbrName: 'PROG LANG PRIN',
  genEdType: 'NO',
  building: 'ENG3',
  room: '318',
  teachers: ['NNN'],
  position: {
    start: 0,
    end: 0,
  },

  hasOverlap: false,
  overlaps: [],
}

const examTemplate: ExamClass = {
  courseNo: '2110316',
  abbrName: 'PROG LANG PRIN',
  genEdType: 'NO',
  teachers: ['NNN'],
  midterm: {
    date: '',
    period: { start: '', end: '' },
  },
  final: {
    date: '',
    period: { start: '', end: '' },
  },
  isHidden: false,

  hasOverlap: false,
  overlaps: [],
}

const notOverlap: CourseOverlap = { hasOverlap: false, classes: [], exams: [] }

function createMockCourse(courseNo: string, overlaps: string[] | null): ScheduleClass[] {
  if (overlaps === null) {
    return []
  }
  const hasOverlap = overlaps.length > 0
  return [{ ...courseTemplate, courseNo, overlaps, hasOverlap }]
}

function createMockExam(courseNo: string, overlaps: string[] | null): ExamClass[] {
  if (overlaps === null) {
    return []
  }
  const hasOverlap = overlaps.length > 0
  return [{ ...examTemplate, courseNo, overlaps, hasOverlap }]
}

function createExpectedOverlap(
  overlaps: string[] | null,
  isClassOverlap: boolean,
  isExamOverlap: boolean
): CourseOverlap | undefined {
  if (overlaps === null) {
    return undefined
  }
  const hasOverlap = overlaps.length > 0
  if (hasOverlap) {
    return {
      classes: isClassOverlap ? overlaps : [],
      exams: isExamOverlap ? overlaps : [],
      hasOverlap,
    }
  }
  return notOverlap
}

describe('getOverlappingCourses', () => {
  it.each`
    overlaps1               | overlaps2     | overlaps3     | expectedOverlap1 | expectedOverlap2 | expectedOverlap3
    ${null}                 | ${null}       | ${null}       | ${null}          | ${null}          | ${null}
    ${[]}                   | ${null}       | ${null}       | ${[]}            | ${null}          | ${null}
    ${[]}                   | ${[]}         | ${[]}         | ${[]}            | ${[]}            | ${[]}
    ${['2']}                | ${['1']}      | ${null}       | ${['2']}         | ${['1']}         | ${null}
    ${['2', '2']}           | ${['1', '1']} | ${[]}         | ${['2']}         | ${['1']}         | ${[]}
    ${['2', '2', '3', '3']} | ${['1', '1']} | ${['1', '1']} | ${['2', '3']}    | ${['1']}         | ${['1']}
  `('', async ({ overlaps1, overlaps2, overlaps3, expectedOverlap1, expectedOverlap2, expectedOverlap3 }) => {
    const { getOverlappingCourses } = await import('.')

    const mockCourse = [
      ...createMockCourse('1', overlaps1),
      ...createMockCourse('2', overlaps2),
      ...createMockCourse('3', overlaps3),
    ]
    const mockExam = [
      ...createMockExam('1', overlaps1),
      ...createMockExam('2', overlaps2),
      ...createMockExam('3', overlaps3),
    ]

    const result1: CourseOverlapMap = getOverlappingCourses(mockCourse, [], [])
    expect(result1).toEqual({
      '1': createExpectedOverlap(expectedOverlap1, true, false),
      '2': createExpectedOverlap(expectedOverlap2, true, false),
      '3': createExpectedOverlap(expectedOverlap3, true, false),
    })

    const result2: CourseOverlapMap = getOverlappingCourses(mockCourse, mockExam, [])
    const result3: CourseOverlapMap = getOverlappingCourses(mockCourse, [], mockExam)
    const result4: CourseOverlapMap = getOverlappingCourses(mockCourse, mockExam, mockExam)

    const expectedResult2 = {
      '1': createExpectedOverlap(expectedOverlap1, true, true),
      '2': createExpectedOverlap(expectedOverlap2, true, true),
      '3': createExpectedOverlap(expectedOverlap3, true, true),
    }
    expect(result2).toEqual(expectedResult2)
    expect(result3).toEqual(expectedResult2)
    expect(result4).toEqual(expectedResult2)
  })
})
