import { Course } from '@thinc-org/chula-courses'
import { parseISO, format } from 'date-fns'
import { th } from 'date-fns/locale'

import { ExamClass } from '../types'

export function getExamDate(scheduleClass: ExamClass | Course, isFinal: boolean) {
  const date = isFinal ? scheduleClass.final?.date : scheduleClass.midterm?.date
  if (!date) {
    return 'TBA'
  }

  const dateObj = parseISO(date)
  return format(dateObj, 'dd MMM yyyy', { locale: th })
}
