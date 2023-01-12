import { Course, Period } from '@libs/codegen'

import { ExamClass } from '../types'

export function getExamPeriod(scheduleClass: ExamClass | Course): {
  midtermPeriod: string
  finalPeriod: string
}
export function getExamPeriod(scheduleClass: ExamClass | Course, isFinal: boolean): string
export function getExamPeriod(scheduleClass: ExamClass | Course, isFinal?: boolean) {
  if (typeof isFinal === 'boolean') {
    return isFinal ? getFinalExamPeriod(scheduleClass) : getMidtermExamPeriod(scheduleClass)
  }
  return {
    midtermPeriod: getMidtermExamPeriod(scheduleClass),
    finalPeriod: getFinalExamPeriod(scheduleClass),
  }
}

export function getMidtermExamPeriod(scheduleClass: ExamClass | Course) {
  return getFormattedExamPeriod(scheduleClass.midterm?.period)
}

export function getFinalExamPeriod(scheduleClass: ExamClass | Course) {
  return getFormattedExamPeriod(scheduleClass.final?.period)
}

export function getFormattedExamPeriod(period: Period | undefined) {
  if (!period) {
    return 'TBA'
  }
  return `${period.start} - ${period.end}`
}