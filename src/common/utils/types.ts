import { Course, Class } from '@thinc-org/chula-courses'

export type ExamClass = Pick<Course, 'courseNo' | 'abbrName' | 'genEdType' | 'midterm' | 'final'> &
  Omit<Class, 'type'> & {
    overlaps: string[]
    hasOverlap?: boolean
    isHidden: boolean
  }

export type CourseKey = Pick<Course, 'courseNo' | 'studyProgram' | 'academicYear' | 'semester'>
