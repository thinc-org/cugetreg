import { CourseCartItem } from '@web/store'

import { Class, Course } from '@libs/codegen'

export type ExamClass = Pick<
  CourseCartItem,
  'courseNo' | 'abbrName' | 'genEdType' | 'midterm' | 'final' | 'color'
> &
  Omit<Class, 'type'> & {
    overlaps: string[]
    hasOverlap?: boolean
    isHidden: boolean
  }

export type CourseKey = Pick<Course, 'courseNo' | 'studyProgram' | 'academicYear' | 'semester'>
