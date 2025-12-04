import { PgInsertValue } from 'drizzle-orm/pg-core'

import { course, section, sectionClass } from '../../schema/courseData.js'
import { db } from '../utils/client.js'
import { withTimeLog } from '../utils/log.js'
import { classKey, courseData, getKey } from './_shared.js'

export const seedClasses = () =>
  withTimeLog('Seed Classes: Total', async () => {
    const payload = await withTimeLog('Seed Classes: Payload', async () => {
      const coursesData = await db
        .select({
          id: course.id,
          studyProgram: course.studyProgram,
          academicYear: course.academicYear,
          semester: course.semester,
          courseNo: course.courseNo,
        })
        .from(course)

      const mapToCourseId = new Map<string, string>()
      coursesData.forEach((c) => mapToCourseId.set(getKey(c), c.id))

      const sectionsData = await db
        .select({
          id: section.id,
          courseId: section.courseId,
          sectionNo: section.sectionNo,
        })
        .from(section)
        .execute()

      const mapToSectionId = new Map<string, string>()
      sectionsData.forEach((s) =>
        mapToSectionId.set(classKey(s.courseId, s.sectionNo), s.id),
      )

      const classes = courseData.flatMap((c) =>
        c.sections.flatMap((section) =>
          section.classes.map((cls) => ({
            sectionId: mapToSectionId.get(
              classKey(mapToCourseId.get(getKey(c))!, +section.sectionNo),
            )!,
            type: cls.type,
            dayOfWeek: cls.dayOfWeek,
            periodStart: cls.period.start,
            periodEnd: cls.period.end,
            building: cls.building,
            room: cls.room,
            professors: cls.teachers,
          })),
        ),
      ) satisfies PgInsertValue<typeof sectionClass>[]

      return classes
    })

    await withTimeLog('Seed Classes: Push', async () => {
      let index = 0
      while (index < payload.length) {
        const next = index + 100
        await db.insert(sectionClass).values(payload.slice(index, next))
        index = next
      }
    })
  })
