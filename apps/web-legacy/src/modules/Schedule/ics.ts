import toast from 'react-hot-toast'

import * as ics from 'ics'

import { CourseCartItem } from '@web/store'

import { ExamPeriod, Maybe } from '@cgr/codegen'

function createSchedule(
  course: CourseCartItem,
  period: Maybe<ExamPeriod> | undefined,
  name: string
) {
  if (!period?.date || !period.period?.start || !period.period?.end) {
    return null
  }

  const date = new Date(period.date)
  const start = period.period.start.split(':').map(Number)
  const end = period.period.end.split(':').map(Number)

  if (isNaN(start[0]) || isNaN(start[1]) || isNaN(end[0]) || isNaN(end[1])) {
    console.error(
      `Invalid time format for ${course.courseNo}: ${period.period.start} or ${period.period.end}`
    )
    return null
  }

  date.setUTCHours(start[0])
  date.setUTCMinutes(start[1])

  // We save BE year in Database as UTC 💀
  date.setUTCFullYear(date.getUTCFullYear() - 543)
  // Subtract 7 hours to make it UTC
  date.setUTCHours(date.getUTCHours() - 7)

  const minutes = (end[0] - start[0]) * 60 + (end[1] - start[1])

  console.log({ utc: date.toISOString(), local: date.toLocaleString() })

  return {
    title: course.abbrName,
    description: `${name} Exam ${course.courseNo} ${course.courseNameEn}`,
    // No exam start before 7AM
    start: [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
    ],
    startInputType: 'utc',
    duration: { minutes },
    // TODO add location
  } satisfies ics.EventAttributes
}

function createSchedules(courses: CourseCartItem[]) {
  const events: ics.EventAttributes[] = []

  for (const course of courses) {
    const { midterm, final } = course

    const midtermExam = createSchedule(course, midterm, 'Midterm')
    const finalExam = createSchedule(course, final, 'Final')

    if (midtermExam) {
      events.push(midtermExam)
    }

    if (finalExam) {
      events.push(finalExam)
    }
  }

  if (events.length === 0) {
    toast.error('ไม่สามารถสร้าง ics ได้เนื่องจากไม่มีการสอบ')
    return undefined
  }

  const { value, error } = ics.createEvents(events)

  if (error) {
    toast.error(`Failed to generate exam schedule: ${error}`)
  }

  return value
}

export function downloadExamSchedules(courses: CourseCartItem[]) {
  const value = createSchedules(courses)

  if (!value) {
    return
  }

  const blob = new Blob([value], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'exam.ics'
  anchor.click()
  anchor.remove()
}
