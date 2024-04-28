import { describe, expect, it } from 'vitest'

import {
  expectedNonOverlappingCourses,
  expectedThreeOverlappingClassesAndExams,
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
} from '@web/__mock__/overlap'

import { getOverlappingCourses } from '.'

describe('getOverlappingCourses', () => {
  it('No course selected should return nothing', () => {
    const result = getOverlappingCourses([], [], [])
    expect(result).toEqual({})
  })
  it('Course selected exactly once should return no overlap', () => {
    const result = getOverlappingCourses(
      [mockNonOverlappingCourses[0]],
      [mockNonOverlappingExams[0]],
      [mockNonOverlappingExams[0]]
    )
    expect(result).toEqual({ '200000': expectedNonOverlappingCourses['200000'] })
  })
  it('3 non-overlapping courses should return non-overlapping each ', () => {
    const result = getOverlappingCourses(mockNonOverlappingCourses, [], [])
    expect(result).toEqual(expectedNonOverlappingCourses)
  })
  it('2 overlapping classes should return overlap for each other', () => {
    const result = getOverlappingCourses(mockTwoOverlappingCourses_1, [], [])
    expect(result).toEqual(expectedTwoOverlappingCourses_1)
  })
  it('2 overlapping classes and 1 non-overlapping class should return overlap and no overlap', () => {
    const result1 = getOverlappingCourses(
      [mockNonOverlappingCourses[0], ...mockNonOverlappingCourses],
      [],
      []
    )
    const result2 = getOverlappingCourses(
      [...mockNonOverlappingCourses, mockNonOverlappingCourses[0]],
      [],
      []
    )
    const expectedResult = {
      '200000': expectedNonOverlappingCourses['200000'],
      ...expectedNonOverlappingCourses,
    }
    expect(result1).toEqual(expectedResult)
    expect(result2).toEqual(expectedResult)
  })
  it('2 double overlapping classes should return overlap only once', () => {
    const result = getOverlappingCourses(mockTwoOverlappingCourses_2, [], [])
    expect(result).toEqual(expectedTwoOverlappingCourses_2)
  })
  it('A class, overlapping with 2 other classes twice, should return two unique overlaps', () => {
    const result = getOverlappingCourses(mockThreeOverlappingCourses, [], [])
    expect(result).toEqual(expectedThreeOverlappingCourses)
  })
  it('2 overlapping classes and midterm exams should return both exam and class overlaps', () => {
    const result = getOverlappingCourses(mockTwoOverlappingCourses_1, mockTwoOverlappingExams_1, [])
    expect(result).toEqual(expectedTwoOverlappingClassesAndExams_1)
  })
  it('2 overlapping classes and final exams return both exam and class overlaps', () => {
    const result = getOverlappingCourses(mockTwoOverlappingCourses_1, [], mockTwoOverlappingExams_1)
    expect(result).toEqual(expectedTwoOverlappingClassesAndExams_1)
  })
  it('2 overlapping both midterm and final exams should return both exam and class overlaps only once', () => {
    const result = getOverlappingCourses(
      mockTwoOverlappingCourses_1,
      mockTwoOverlappingExams_1,
      mockTwoOverlappingExams_1
    )
    expect(result).toEqual(expectedTwoOverlappingClassesAndExams_1)
  })
  it('2 overlapping exams with 1 non-overlapping exam should return overlap and no overlap', () => {
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
  it('2 double overlapping exams should return exam class overlap only once', () => {
    const result = getOverlappingCourses(
      mockTwoOverlappingCourses_2,
      mockTwoOverlappingExams_2,
      mockTwoOverlappingExams_2
    )
    expect(result).toEqual(expectedTwoOverlappingClassesAndExams_2)
  })
  it('An exam, overlapping with 2 other exams twice, should return two unique overlaps', () => {
    const result = getOverlappingCourses(
      mockThreeOverlappingCourses,
      mockThreeOverlappingExams,
      mockThreeOverlappingExams
    )
    expect(result).toEqual(expectedThreeOverlappingClassesAndExams)
  })
  it('A course with overlapping exams but no classes, should not crash', () => {
    expect(() => {
      getOverlappingCourses([], mockTwoOverlappingExams_1, mockTwoOverlappingExams_1)
    }).not.toThrow()
  })
})
