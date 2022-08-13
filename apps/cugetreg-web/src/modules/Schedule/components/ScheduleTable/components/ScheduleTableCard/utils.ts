import { useTranslation } from 'react-i18next'

import { CourseOverlap } from '@web/modules/Schedule/components/Schedule/utils'

export function useOverlapWarning(overlaps?: CourseOverlap) {
  const { t } = useTranslation('scheduleTableCard')
  if (!overlaps || !overlaps.hasOverlap) {
    return ''
  }
  const overlappingClasses = `${t('classOverlap')} ${overlaps.classes.join(', ')}`
  const overlappingExams = `${t('examOverlap')} ${overlaps.exams.join(', ')}`
  if (overlaps.classes.length > 0 && overlaps.exams.length > 0) {
    return [overlappingClasses, overlappingExams].join(` ${t('and')}`)
  }
  if (overlaps.classes.length > 0) {
    return overlappingClasses
  }
  if (overlaps.exams.length > 0) {
    return overlappingExams
  }
  return ''
}
