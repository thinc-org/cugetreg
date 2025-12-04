import { PgInsertValue } from 'drizzle-orm/pg-core'

import { course, section } from '../../schema/courseData.js'
import { db } from '../utils/client.js'
import { withTimeLog } from '../utils/log.js'
import { courseData, getKey } from './_shared.js'

export const seedSections = () =>
  withTimeLog('Seed Sections: Total', async () => {
    const payload = await withTimeLog('Seed Sections: Payload', async () => {
      const coursesData = await db
        .select({
          id: course.id,
          studyProgram: course.studyProgram,
          academicYear: course.academicYear,
          semester: course.semester,
          courseNo: course.courseNo,
        })
        .from(course)

      const mapToId = new Map<string, string>()
      coursesData.forEach((c) => mapToId.set(getKey(c), c.id))

      const sections = courseData.flatMap((c) =>
        c.sections.map((section) => ({
          courseId: mapToId.get(getKey(c))!,
          sectionNo: +section.sectionNo,
          closed: section.closed,
          regis: section.capacity.current,
          max: section.capacity.max,
          note: section.note,
          genEdType: section.genEdType,
        })),
      ) satisfies PgInsertValue<typeof section>[]

      return sections
    })

    await withTimeLog('Seed Sections: Push', async () => {
      let index = 0
      while (index < payload.length) {
        const next = index + 100
        await db.insert(section).values(payload.slice(index, next))
        index = next
      }
    })
  })
