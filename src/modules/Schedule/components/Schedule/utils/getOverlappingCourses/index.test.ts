import {
  expectedNonOverlappingCourses,
  expectedThreeOverlappingCourses,
  expectedTwoOverlappingClassesAndExams_1,
  expectedTwoOverlappingClassesAndExams_2,
  expectedTwoOverlappingCourses_1,
  expectedTwoOverlappingCourses_2,
  mockNonOverlappingCourses,
  mockNonOverlappingExams,
  mockThreeOverlappingCourses,
  mockThreeOverlappingExams,
  mockTwoOverlappingCourses_1,
  mockTwoOverlappingCourses_2,
  mockTwoOverlappingExams_1,
  mockTwoOverlappingExams_2,
  expectedThreeOverlappingClassesAndExams,
} from '@/__mock__/overlap'

import { getOverlappingCourses } from '.'

describe('getOverlappingCourses', () => {
  test('No course selected should return nothing', () => {
    const result = getOverlappingCourses([], [], [])
    expect(result).toEqual({})
  })
  test('Course selected exactly once should return no overlap', () => {
    const result = getOverlappingCourses(
      [mockNonOverlappingCourses[0]],
      [mockNonOverlappingExams[0]],
      [mockNonOverlappingExams[0]]
    )
    expect(result).toEqual({ '200000': expectedNonOverlappingCourses['200000'] })
  })
  test('3 selected courses but not overlapping should return non-overlapping each ', () => {
    const result = getOverlappingCourses(mockNonOverlappingCourses, [], [])
    expect(result).toEqual(expectedNonOverlappingCourses)
  })
  test('2 classes are overlapping should return overlap for each other', () => {
    const result = getOverlappingCourses(mockTwoOverlappingCourses_1, [], [])
    expect(result).toEqual(expectedTwoOverlappingCourses_1)
  })
  test('2 classes are overlapping but 1 is not should return overlap and no overlap', () => {
    const result1 = getOverlappingCourses([mockNonOverlappingCourses[0], ...mockNonOverlappingCourses], [], [])
    const result2 = getOverlappingCourses([...mockNonOverlappingCourses, mockNonOverlappingCourses[0]], [], [])
    const expectedResult = { '200000': expectedNonOverlappingCourses['200000'], ...expectedNonOverlappingCourses }
    expect(result1).toEqual(expectedResult)
    expect(result2).toEqual(expectedResult)
  })
  test('2 classes are overlapping twice should return overlap only once', () => {
    const result = getOverlappingCourses(mockTwoOverlappingCourses_2, [], [])
    expect(result).toEqual(expectedTwoOverlappingCourses_2)
  })
  test('A class is overlapping with 2 classes twice should return two unique overlaps', () => {
    const result = getOverlappingCourses(mockThreeOverlappingCourses, [], [])
    expect(result).toEqual(expectedThreeOverlappingCourses)
  })
  test('2 classes and midterm exams are overlapping should return both exam and class overlaps', () => {
    const result = getOverlappingCourses(mockTwoOverlappingCourses_1, mockTwoOverlappingExams_1, [])
    expect(result).toEqual(expectedTwoOverlappingClassesAndExams_1)
  })
  test('2 classes and final exams are overlapping return both exam and class overlaps', () => {
    const result = getOverlappingCourses(mockTwoOverlappingCourses_1, [], mockTwoOverlappingExams_1)
    expect(result).toEqual(expectedTwoOverlappingClassesAndExams_1)
  })
  test('2 classes and both midterm and final exams are overlapping should return both exam and class overlaps only once', () => {
    const result = getOverlappingCourses(
      mockTwoOverlappingCourses_1,
      mockTwoOverlappingExams_1,
      mockTwoOverlappingExams_1
    )
    expect(result).toEqual(expectedTwoOverlappingClassesAndExams_1)
  })
  test('2 classes and exams are overlapping but 1 is not should return overlap and no overlap', () => {
    const result1 = getOverlappingCourses(
      [mockNonOverlappingCourses[0], ...mockTwoOverlappingCourses_1],
      [mockNonOverlappingExams[0], ...mockTwoOverlappingExams_1],
      [mockNonOverlappingExams[0], ...mockTwoOverlappingExams_1]
    )
    const result2 = getOverlappingCourses(
      [mockNonOverlappingCourses[0], ...mockTwoOverlappingCourses_1],
      [...mockTwoOverlappingExams_1, mockNonOverlappingExams[0]],
      [...mockTwoOverlappingExams_1, mockNonOverlappingExams[0]]
    )
    const expectedResult = {
      '200000': expectedNonOverlappingCourses['200000'],
      ...expectedTwoOverlappingClassesAndExams_1,
    }
    expect(result1).toEqual(expectedResult)
    expect(result2).toEqual(expectedResult)
  })
  test('2 classes and exams are overlapping twice should return both exam and class overlaps only once', () => {
    const result = getOverlappingCourses(
      mockTwoOverlappingCourses_2,
      mockTwoOverlappingExams_2,
      mockTwoOverlappingExams_2
    )
    expect(result).toEqual(expectedTwoOverlappingClassesAndExams_2)
  })
  test('A class and exam are both overlapping with 2 other classes twice should return two unique both exams and classes', () => {
    const result = getOverlappingCourses(
      mockThreeOverlappingCourses,
      mockThreeOverlappingExams,
      mockThreeOverlappingExams
    )
    expect(result).toEqual(expectedThreeOverlappingClassesAndExams)
  })
})
