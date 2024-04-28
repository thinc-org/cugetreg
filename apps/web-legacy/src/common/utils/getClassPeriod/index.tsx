import { Class } from '@cgr/codegen'

export function getClassPeriod(sectionClass: Class) {
  const period = sectionClass.period
  if (period) {
    return `${period.start} - ${period.end}`
  }
  return ''
}
