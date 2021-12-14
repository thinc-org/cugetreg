import { Class } from '@thinc-org/chula-courses'

export function getClassPeriod(sectionClass: Class) {
  const period = sectionClass.period
  if (period) {
    return `${period.start} - ${period.end}`
  }
  return ''
}
