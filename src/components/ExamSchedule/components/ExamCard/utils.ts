import { format } from 'date-fns'
import { ExamClass } from '.'

export function getExamDate(scheduleClass: ExamClass, isFinal: boolean) {
  const date = isFinal ? scheduleClass.final?.date : scheduleClass.midterm?.date
  if (!date) {
    return 'TBA'
  }

  return format(date as Date, 'dd mmm yyyy')
}

export function getExamPeriod(scheduleClass: ExamClass, isFinal: boolean) {
  const period = isFinal ? scheduleClass.final?.period : scheduleClass.midterm?.period
  if (!period) {
    return 'TBA'
  }

  return `${period.start} - ${period.end}`
}
