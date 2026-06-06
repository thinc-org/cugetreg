import { json } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

import { db } from '$lib/db'

import { course, courseInfo } from '@repo/database'

import type { RequestHandler } from './$types.js'

export const GET: RequestHandler = async ({ url }) => {
  const courseNo = url.searchParams.get('courseNo')
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '20'), 100)

  const baseQuery = db
    .select({
      courseNo: course.courseNo,
      abbrName: courseInfo.abbrName,
      courseNameEn: courseInfo.courseNameEn,
      courseNameTh: courseInfo.courseNameTh,
      credit: courseInfo.credit,
      studyProgram: course.studyProgram,
      academicYear: course.academicYear,
      semester: course.semester,
      genEdType: course.genEdType,
    })
    .from(course)
    .innerJoin(courseInfo, eq(course.courseNo, courseInfo.courseNo))

  const rows = courseNo
    ? await baseQuery.where(eq(course.courseNo, courseNo)).limit(1)
    : await baseQuery.limit(limit)

  return json({ courses: rows })
}
