import { CourseKey } from '@/common/utils/types'

export function getCourseKeyString(course: CourseKey): string {
  return `${course.courseNo}-${course.studyProgram}-${course.academicYear}-${course.semester}`
}
