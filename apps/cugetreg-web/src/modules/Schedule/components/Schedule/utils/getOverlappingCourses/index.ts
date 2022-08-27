import { ExamClass } from '@web/common/utils/types'
import { uniq } from '@web/utils/uniq'

import { CourseOverlapMap, ScheduleClass } from '..'

/**
 * get a course overlap map which tells that for each course (key),
 * what other courses are overlapping with it in terms of classes and exams (value)
 * for the purpose of showing overlaps warning
 * @param classes a list of class which have been checked for overlapping
 * @param midtermClasses a list of midterm exams which have been checked for overlapping
 * @param finalClasses a list of final exams which have been checked for overlapping
 * @returns A record of key `courseNo` and value `CourseOverlap`
 */
export function getOverlappingCourses(
  classes: ScheduleClass[],
  midtermClasses: ExamClass[],
  finalClasses: ExamClass[]
) {
  const courses: CourseOverlapMap = {}
  const courseNosFromClasses = classes.map((c) => c.courseNo)
  const courseNosFromMidterms = midtermClasses.map((c) => c.courseNo)
  const courseNosFromFinals = finalClasses.map((c) => c.courseNo)
  const courseNos = uniq([
    ...courseNosFromClasses,
    ...courseNosFromMidterms,
    ...courseNosFromFinals,
  ])
  courseNos.forEach((courseNo) => {
    courses[courseNo] = {
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
