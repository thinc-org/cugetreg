import { Course, Class } from '@thinc-org/chula-courses'

export type ExamClass = Pick<Course, 'courseNo' | 'abbrName' | 'genEdType' | 'midterm' | 'final'> &
  Omit<Class, 'type'> & {
    hasOverlap?: boolean
    isHidden: boolean
  }
