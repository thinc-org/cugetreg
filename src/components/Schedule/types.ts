import { Course, Class } from '@thinc-org/chula-courses'

export type ScheduleClass = Pick<Course, 'courseNo' | 'abbrName' | 'genEdType'> & Omit<Class, 'type'>
