import {
  expectedOverlappingBoth,
  expectedOverlappingCourses,
  mockOverlappingCourses,
  mockOverlappingExams,
} from '@/__mock__/overlap'

import { getOverlappingCourses } from '.'

describe('getOverlappingCourses', () => {
  test('No course selected should return nothing', () => {
    const result = getOverlappingCourses([], [], [])
    expect(result).toEqual({})
  })
  test('Course selected exactly once should return no overlap', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200000']],
      [mockOverlappingExams['200000']],
      [mockOverlappingExams['200000']]
    )
    expect(result).toEqual({ '200000': expectedOverlappingCourses['200000'] })
  })
  test('3 selected courses but not overlapping should return non-overlapping each ', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200000'], mockOverlappingCourses['200001'], mockOverlappingCourses['200002']],
      [],
      []
    )
    expect(result).toEqual({
      '200000': expectedOverlappingCourses['200000'],
      '200001': expectedOverlappingCourses['200001'],
      '200002': expectedOverlappingCourses['200002'],
    })
  })
  test('2 classes are overlapping should return overlap for each other', () => {
    const result = getOverlappingCourses([mockOverlappingCourses['200003'], mockOverlappingCourses['200004']], [], [])
    expect(result).toEqual({
      '200003': expectedOverlappingCourses['200003'],
      '200004': expectedOverlappingCourses['200004'],
    })
  })
  test('2 classes are overlapping but 1 is not should return overlap and no overlap', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200000'], mockOverlappingCourses['200003'], mockOverlappingCourses['200004']],
      [],
      []
    )
    expect(result).toEqual({
      '200000': expectedOverlappingCourses['200000'],
      '200003': expectedOverlappingCourses['200003'],
      '200004': expectedOverlappingCourses['200004'],
    })
  })
  test('2 classes are overlapping twice should return overlap only once', () => {
    const result = getOverlappingCourses([mockOverlappingCourses['200005'], mockOverlappingCourses['200006']], [], [])
    expect(result).toEqual({
      '200005': expectedOverlappingCourses['200005'],
      '200006': expectedOverlappingCourses['200006'],
    })
  })
  test('A class is overlapping with 2 classes twice should return two unique overlaps', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200007'], mockOverlappingCourses['200008'], mockOverlappingCourses['200009']],
      [],
      []
    )
    expect(result).toEqual({
      '200007': expectedOverlappingCourses['200007'],
      '200008': expectedOverlappingCourses['200008'],
      '200009': expectedOverlappingCourses['200009'],
    })
  })
  test('2 classes and midterm exams are overlapping should return both exam and class overlaps', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200003'], mockOverlappingCourses['200004']],
      [mockOverlappingExams['200003'], mockOverlappingExams['200004']],
      []
    )
    expect(result).toEqual({
      '200003': expectedOverlappingBoth['200003'],
      '200004': expectedOverlappingBoth['200004'],
    })
  })
  test('2 classes and final exams are overlapping return both exam and class overlaps', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200003'], mockOverlappingCourses['200004']],
      [],
      [mockOverlappingExams['200003'], mockOverlappingExams['200004']]
    )
    expect(result).toEqual({
      '200003': expectedOverlappingBoth['200003'],
      '200004': expectedOverlappingBoth['200004'],
    })
  })
  test('2 classes and both midterm and final exams are overlapping should return both exam and class overlaps only once', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200003'], mockOverlappingCourses['200004']],
      [mockOverlappingExams['200003'], mockOverlappingExams['200004']],
      [mockOverlappingExams['200003'], mockOverlappingExams['200004']]
    )
    expect(result).toEqual({
      '200003': expectedOverlappingBoth['200003'],
      '200004': expectedOverlappingBoth['200004'],
    })
  })
  test('2 classes and exams are overlapping but 1 is not should return overlap and no overlap', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200000'], mockOverlappingCourses['200003'], mockOverlappingCourses['200004']],
      [mockOverlappingExams['200000'], mockOverlappingExams['200003'], mockOverlappingExams['200004']],
      [mockOverlappingExams['200000'], mockOverlappingExams['200003'], mockOverlappingExams['200004']]
    )
    expect(result).toEqual({
      '200000': expectedOverlappingBoth['200000'],
      '200003': expectedOverlappingBoth['200003'],
      '200004': expectedOverlappingBoth['200004'],
    })
  })
  test('2 classes and exams are overlapping twice should return both exam and class overlaps only once', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200005'], mockOverlappingCourses['200006']],
      [mockOverlappingExams['200005'], mockOverlappingExams['200006']],
      [mockOverlappingExams['200005'], mockOverlappingExams['200006']]
    )
    expect(result).toEqual({
      '200005': expectedOverlappingBoth['200005'],
      '200006': expectedOverlappingBoth['200006'],
    })
  })
  test('A class and exam are both overlapping with 2 other classes twice should return two unique both exams and classes', () => {
    const result = getOverlappingCourses(
      [mockOverlappingCourses['200007'], mockOverlappingCourses['200008'], mockOverlappingCourses['200009']],
      [mockOverlappingExams['200007'], mockOverlappingExams['200008'], mockOverlappingExams['200009']],
      [mockOverlappingExams['200007'], mockOverlappingExams['200008'], mockOverlappingExams['200009']]
    )
    expect(result).toEqual({
      '200007': expectedOverlappingBoth['200007'],
      '200008': expectedOverlappingBoth['200008'],
      '200009': expectedOverlappingBoth['200009'],
    })
  })
})
