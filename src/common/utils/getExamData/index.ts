import { Course } from '@thinc-org/chula-courses/types'
import { parseISO, format } from 'date-fns'

import { ExamClass } from '../types'

export default function getExamDate(scheduleClass: ExamClass | Course, isFinal: boolean) {
  const date = isFinal ? scheduleClass.final?.date : scheduleClass.midterm?.date
  if (!date) {
    return 'TBA'
  }

  const dateObj = parseISO(date)
  return format(dateObj, 'dd MMM yyyy')
}
