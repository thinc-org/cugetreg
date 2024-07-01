import fs from 'node:fs/promises'

import { withTimeLog } from '../utils/log.js'
import { CourseSeed } from '../utils/types.js'

export const courseData = await withTimeLog(
  'Read and parse courses',
  async () => {
    const courses = JSON.parse(
      await fs.readFile('./data/courses.json', 'utf-8'),
    ) as CourseSeed[]
    console.log(`Courses: ${courses.length}`)
    return courses
  },
)

type Compat = {
  studyProgram: string
  academicYear: number | string
  semester: string
  courseNo: string
}

export function getKey(course: Compat) {
  return `${course.studyProgram}-${course.academicYear}-${course.semester}-${course.courseNo}`
}

export function classKey(courseId: string, sectionNo: number) {
  return `${courseId}-${sectionNo}`
}
