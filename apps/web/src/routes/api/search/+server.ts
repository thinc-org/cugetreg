import { error, json } from '@sveltejs/kit'
import { and, count, eq, ilike, like, or, sum } from 'drizzle-orm'

import { db } from '$lib/db.js'

import {
  allSemesters,
  allStudyPrograms,
  course,
  courseInfo,
  review,
  section,
  type Semester,
  type StudyProgram,
} from '@repo/database'
import { isEnum } from '@repo/utils'

import type { RequestHandler } from './$types.js'

const defaultStudyProgram = 'S' satisfies StudyProgram
const defaultAcademicYear = '2567' satisfies `${number}`
const defaultSemester = '2' satisfies Semester

export const GET: RequestHandler = async ({ url }) => {
  const courseName = url.searchParams.get('courseName') || ''

  const studyProgram =
    url.searchParams.get('studyProgram') || defaultStudyProgram
  const academicYear = +(
    url.searchParams.get('academicYear') || defaultAcademicYear
  )
  const semester = url.searchParams.get('semester') || defaultSemester

  const limit = +(url.searchParams.get('limit') || '10')
  const offset = +(url.searchParams.get('offset') || '0')

  if (
    !isEnum(allStudyPrograms, studyProgram) ||
    isNaN(academicYear) ||
    !isEnum(allSemesters, semester) ||
    isNaN(limit) ||
    limit < 1 ||
    isNaN(offset) ||
    offset < 0
  ) {
    error(400, 'Invalid query parameters')
  }

  const result = await searchCourse(
    courseName,
    studyProgram,
    academicYear,
    semester,
    limit,
    offset,
  )

  return json(result)
}

async function searchCourse(
  courseName: string,
  studyProgram: StudyProgram,
  academicYear: number,
  semester: Semester,
  limit: number,
  offset: number,
) {
  const sectionAgg = db
    .select({
      courseId: section.courseId,
      regis: sum(section.regis).as('regis'),
      seat: sum(section.max).as('seat'),
    })
    .from(section)
    .groupBy(section.courseId)
    .as('sectionAgg')

  const reviewAgg = db
    .select({
      courseNo: review.courseNo,
      reviewCount: count(review.id).as('review_count'),
    })
    .from(review)
    .where(eq(review.status, 'APPROVED'))
    .groupBy(review.courseNo)
    .as('reviewAgg')

  return db
    .select({
      courseNo: course.courseNo,
      genEdType: course.genEdType,
      abbrName: courseInfo.abbrName,
      courseNameEn: courseInfo.courseNameEn,
      courseNameTh: courseInfo.courseNameTh,
      credit: courseInfo.credit,
      regis: sectionAgg.regis,
      seat: sectionAgg.seat,
      reviewCount: reviewAgg.reviewCount,
    })
    .from(course)
    .leftJoin(courseInfo, eq(course.courseNo, courseInfo.courseNo))
    .leftJoin(sectionAgg, eq(course.id, sectionAgg.courseId))
    .leftJoin(reviewAgg, eq(course.courseNo, reviewAgg.courseNo))
    .where(
      and(
        eq(course.studyProgram, studyProgram),
        eq(course.academicYear, academicYear),
        eq(course.semester, semester),
        or(
          like(course.courseNo, `%${courseName}%`),
          ilike(courseInfo.abbrName, `%${courseName}%`),
          ilike(courseInfo.courseNameEn, `%${courseName}%`),
          ilike(courseInfo.courseNameTh, `%${courseName}%`),
        ),
      ),
    )
    .limit(limit)
    .offset(offset)
}

export type CourseSearchResult = Awaited<
  ReturnType<typeof searchCourse>
>[number]
