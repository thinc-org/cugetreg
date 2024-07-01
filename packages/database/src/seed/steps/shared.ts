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
