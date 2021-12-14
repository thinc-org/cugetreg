import { mockCourseData } from '@/__mock__/courses'
import { ExamClass } from '@/common/utils/types'
import { CourseOverlap, CourseOverlapMap, ScheduleClass } from '@/modules/Schedule/components/Schedule/utils'

const mockCourse = mockCourseData[0]
export const mockItem = {
  ...mockCourse,
  color: 'pink',
  isHidden: false,
  selectedSectionNo: '1',
} as const
export const courseTemplate: Omit<ScheduleClass, 'classIndex'> = {
  courseNo: mockCourse.courseNo,
  abbrName: mockCourse.abbrName,
  studyProgram: mockCourse.studyProgram,
  academicYear: mockCourse.academicYear,
  semester: mockCourse.semester,
  genEdType: mockCourse.genEdType,
  teachers: [],
  sectionNo: '1',
  section: mockCourse.sections[0],
  color: 'pink',
  position: {
    start: 0,
    end: 0,
  },
  hasOverlap: false,
  overlaps: [],
  item: mockItem,
}

export const examTemplate: ExamClass = {
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
  color: 'pink',
  hasOverlap: false,
  overlaps: [],
}

export const noOverlap: CourseOverlap = { hasOverlap: false, classes: [], exams: [] }

/**
 * 200000, 200001, 200002 are not overlapping
 * 200003, 200004 are overlapping exactly once
 * 200006, 200007 are overlapping twice
 * 200010 are overlapping with each 200008 and 200009 twice
 */
export const mockNonOverlappingCourses: ScheduleClass[] = [
  { ...courseTemplate, classIndex: 0, courseNo: '200000' },
  { ...courseTemplate, classIndex: 1, courseNo: '200001' },
  { ...courseTemplate, classIndex: 2, courseNo: '200002' },
]
export const mockTwoOverlappingCourses_1: ScheduleClass[] = [
  { ...courseTemplate, classIndex: 0, courseNo: '200003', hasOverlap: true, overlaps: ['200004'] },
  { ...courseTemplate, classIndex: 1, courseNo: '200004', hasOverlap: true, overlaps: ['200003'] },
]
export const mockTwoOverlappingCourses_2: ScheduleClass[] = [
  { ...courseTemplate, classIndex: 0, courseNo: '200005', hasOverlap: true, overlaps: ['200006', '200006'] },
  { ...courseTemplate, classIndex: 1, courseNo: '200006', hasOverlap: true, overlaps: ['200005', '200005'] },
]
export const mockThreeOverlappingCourses: ScheduleClass[] = [
  { ...courseTemplate, classIndex: 0, courseNo: '200007', hasOverlap: true, overlaps: ['200009', '200009'] },
  { ...courseTemplate, classIndex: 1, courseNo: '200008', hasOverlap: true, overlaps: ['200009', '200009'] },
  {
    ...courseTemplate,
    classIndex: 2,
    courseNo: '200009',
    hasOverlap: true,
    overlaps: ['200007', '200007', '200008', '200008'],
  },
]

export const expectedNonOverlappingCourses: CourseOverlapMap = {
  '200000': { ...noOverlap },
  '200001': { ...noOverlap },
  '200002': { ...noOverlap },
}
export const expectedTwoOverlappingCourses_1: CourseOverlapMap = {
  '200003': { ...noOverlap, hasOverlap: true, classes: ['200004'] },
  '200004': { ...noOverlap, hasOverlap: true, classes: ['200003'] },
}
export const expectedTwoOverlappingCourses_2: CourseOverlapMap = {
  '200005': { ...noOverlap, hasOverlap: true, classes: ['200006'] },
  '200006': { ...noOverlap, hasOverlap: true, classes: ['200005'] },
}
export const expectedThreeOverlappingCourses: CourseOverlapMap = {
  '200007': { ...noOverlap, hasOverlap: true, classes: ['200009'] },
  '200008': { ...noOverlap, hasOverlap: true, classes: ['200009'] },
  '200009': { ...noOverlap, hasOverlap: true, classes: ['200007', '200008'] },
}
/**
 * 200000, 200001, 200002 are not overlapping
 * 200003, 200004 are overlapping exactly once
 * 200006, 200007 are overlapping twice
 * 200010 are overlapping with each 200008 and 200009 twice
 */
export const mockNonOverlappingExams: ExamClass[] = [
  { ...examTemplate, courseNo: '200000' },
  { ...examTemplate, courseNo: '200001' },
  { ...examTemplate, courseNo: '200002' },
]
export const mockTwoOverlappingExams_1: ExamClass[] = [
  { ...examTemplate, courseNo: '200003', hasOverlap: true, overlaps: ['200004'] },
  { ...examTemplate, courseNo: '200004', hasOverlap: true, overlaps: ['200003'] },
]
export const mockTwoOverlappingExams_2: ExamClass[] = [
  { ...examTemplate, courseNo: '200005', hasOverlap: true, overlaps: ['200006', '200006'] },
  { ...examTemplate, courseNo: '200006', hasOverlap: true, overlaps: ['200005', '200005'] },
]
export const mockThreeOverlappingExams: ExamClass[] = [
  { ...examTemplate, courseNo: '200007', hasOverlap: true, overlaps: ['200009', '200009'] },
  { ...examTemplate, courseNo: '200008', hasOverlap: true, overlaps: ['200009', '200009'] },
  {
    ...examTemplate,
    courseNo: '200009',
    hasOverlap: true,
    overlaps: ['200007', '200007', '200008', '200008'],
  },
]

export const expectedNonOverlappingClassesAndExams: CourseOverlapMap = {
  '200000': { ...noOverlap },
  '200001': { ...noOverlap },
  '200002': { ...noOverlap },
}
export const expectedTwoOverlappingClassesAndExams_1: CourseOverlapMap = {
  '200003': { hasOverlap: true, classes: ['200004'], exams: ['200004'] },
  '200004': { hasOverlap: true, classes: ['200003'], exams: ['200003'] },
}
export const expectedTwoOverlappingClassesAndExams_2: CourseOverlapMap = {
  '200005': { hasOverlap: true, classes: ['200006'], exams: ['200006'] },
  '200006': { hasOverlap: true, classes: ['200005'], exams: ['200005'] },
}
export const expectedThreeOverlappingClassesAndExams: CourseOverlapMap = {
  '200007': { hasOverlap: true, classes: ['200009'], exams: ['200009'] },
  '200008': { hasOverlap: true, classes: ['200009'], exams: ['200009'] },
  '200009': { hasOverlap: true, classes: ['200007', '200008'], exams: ['200007', '200008'] },
}
