import fs from 'node:fs/promises'

import { user } from '../../schema/userData.js'
import { db } from '../utils/client.js'
import { withTimeLog } from '../utils/log.js'
import { CourseSeed, ReviewSeed, UserSeed } from '../utils/types.js'

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

export const userData = await withTimeLog('Read and parse users', async () => {
  const users = JSON.parse(
    await fs.readFile('./data/users.json', 'utf-8'),
  ) as UserSeed[]
  console.log(`Users: ${users.length}`)
  return users
})

export const idToEmail = new Map<string, string>()
userData.forEach((user) => idToEmail.set(user._id.$oid, user.email))

export const reviewData = await withTimeLog(
  'Read and parse reviews',
  async () => {
    const reviews = JSON.parse(
      await fs.readFile('./data/reviews.json', 'utf-8'),
    ) as ReviewSeed[]
    console.log(`Reviews: ${reviews.length}`)
    return reviews
  },
)

export async function getEmailToUserIdMap() {
  const eti = await withTimeLog('Read and parse users', async () => {
    const idToEmailMap = await db
      .select({
        id: user.id,
        email: user.email,
      })
      .from(user)

    const emailToId = new Map<string, string>()
    idToEmailMap.forEach((u) => emailToId.set(u.email, u.id))

    return emailToId
  })

  return eti
}
