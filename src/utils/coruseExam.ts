import { Course } from '@thinc-org/chula-courses/types'
import { parseISO, format } from 'date-fns'

import { ExamClass } from '../modules/Schedule/components/ExamSchedule/components/ExamCard'

export function getExamDate(scheduleClass: ExamClass | Course, isFinal: boolean) {
  const date = isFinal ? scheduleClass.final?.date : scheduleClass.midterm?.date
  if (!date) {
    return 'TBA'
  }

  const dateObj = parseISO(date)
  return format(dateObj, 'dd MMM yyyy')
}

export function getExamPeriod(scheduleClass: ExamClass | Course, isFinal: boolean) {
  const period = isFinal ? scheduleClass.final?.period : scheduleClass.midterm?.period
  if (!period) {
    return 'TBA'
  }

  return `${period.start} - ${period.end}`
}
