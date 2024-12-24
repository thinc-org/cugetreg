import { eq } from 'drizzle-orm'

import { course } from '@repo/database'

import { db } from '$lib/db'

import type { PageServerLoad } from './$types.js'

export const load: PageServerLoad = async () => {
  return {
    course: await db
      .select()
      .from(course)
      .where(eq(course.courseNo, '2110101'))
      .orderBy(course.academicYear, course.semester),
  }
}
