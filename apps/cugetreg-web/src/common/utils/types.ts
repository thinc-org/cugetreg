import { Class, Course } from '@cugetreg/codegen'

import { CourseCartItem } from '@web/store'

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
