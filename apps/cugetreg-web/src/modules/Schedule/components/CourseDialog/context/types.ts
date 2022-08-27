import { CourseOverlap } from '@web/modules/Schedule/components/Schedule/utils'
import { CourseCartItem } from '@web/store'

export type CourseDialogContextValue = {
  item: CourseCartItem
  overlaps: CourseOverlap
  onClose: () => void
  onRemove: () => void
}
