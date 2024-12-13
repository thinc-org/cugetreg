import { PgInsertValue } from 'drizzle-orm/pg-core'

import { course, courseInfo } from '../../schema/courseData.js'
import { db } from '../utils/client.js'
import { withTimeLog } from '../utils/log.js'
import { parsePeriod } from '../utils/parsing.js'
import { courseData } from './_shared.js'

export const seedCourses = async () => {
  await withTimeLog('Seed Courses Info: Total', async () => {
    const payload = await withTimeLog(
      'Seed Courses Info: Payload',
      async () => {
        const courseInfoMap: Record<
          string,
          PgInsertValue<typeof courseInfo>
        > = {}

        for (const course of courseData) {
          courseInfoMap[course.courseNo] = {
            courseNo: course.courseNo,
            abbrName: course.abbrName,
            courseNameEn: course.courseNameEn,
            courseNameTh: course.courseNameTh,
            courseDescEn: course.courseDescEn,
            courseDescTh: course.courseDescTh,
            faculty: course.faculty,
            department: course.department,
            credit: String(course.credit),
            creditHours: course.creditHours,
          }
        }

        const payload: PgInsertValue<typeof courseInfo>[] =
          Object.values(courseInfoMap)
        return payload
      },
    )

    await withTimeLog('Seed Courses Info: Push', async () => {
      let index = 0
      while (index < payload.length) {
        const next = index + 100
        await db.insert(courseInfo).values(payload.slice(index, next))
        index = next
      }
    })
  })

  await withTimeLog('Seed Courses: Total', async () => {
    const payload = await withTimeLog('Seed Courses: Payload', async () => {
      const payload: PgInsertValue<typeof course>[] = []

      for (const course of courseData) {
        const midterm = parsePeriod(course.midterm)
        const final = parsePeriod(course.final)

        payload.push({
          studyProgram: course.studyProgram,
          academicYear: +course.academicYear,
          semester: course.semester,
          courseNo: course.courseNo,
          courseCondition: course.courseCondition,
          midtermStart: midterm.start,
          midtermEnd: midterm.end,
          finalStart: final.start,
          finalEnd: final.end,
          genEdType: course.genEdType,
        })
      }

      return payload
    })

    await withTimeLog('Seed Courses: Push', async () => {
      let index = 0
      while (index < payload.length) {
        const next = index + 100
        await db.insert(course).values(payload.slice(index, next))
        index = next
      }
    })
  })
}
