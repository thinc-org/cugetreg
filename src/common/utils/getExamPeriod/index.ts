import { Course } from '@thinc-org/chula-courses'

import { ExamClass } from '../types'

export default function getExamPeriod(scheduleClass: ExamClass | Course, isFinal: boolean) {
  const period = isFinal ? scheduleClass.final?.period : scheduleClass.midterm?.period
  if (!period) {
    return 'TBA'
  }

  return `${period.start} - ${period.end}`
}
