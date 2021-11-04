import { uniq } from 'lodash'

import { ExamClass } from '@/common/utils/types'

import { ScheduleClass, CourseOverlapMap } from '..'

export function getOverlappingCourses(
  classes: ScheduleClass[],
  midtermClasses: ExamClass[],
  finalClasses: ExamClass[]
) {
  const courses: CourseOverlapMap = {}
  classes.forEach((it) => {
    courses[it.courseNo] = {
      hasOverlap: false,
      classes: [],
      exams: [],
    }
  })
  classes.forEach((it) => {
    courses[it.courseNo].classes = [...courses[it.courseNo].classes, ...it.overlaps]
  })
  midtermClasses.forEach((it) => {
    if (it.hasOverlap === true) {
      courses[it.courseNo].exams = [...courses[it.courseNo].exams, ...it.overlaps]
    }
  })
  finalClasses.forEach((it) => {
    if (it.hasOverlap === true) {
      courses[it.courseNo].exams = [...courses[it.courseNo].exams, ...it.overlaps]
    }
  })
  Object.entries(courses).forEach(([, course]) => {
    course.classes = uniq(course.classes)
    course.exams = uniq(course.exams)
    course.hasOverlap = course.classes.length > 0 || course.exams.length > 0
  })
  return courses
}
