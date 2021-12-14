import { CourseOverlap } from '@/modules/Schedule/components/Schedule/utils'
import { CourseCartItem } from '@/store'

export type CourseDialogContextValue = {
  item: CourseCartItem
  overlaps: CourseOverlap
  onClose: () => void
  onRemove: () => void
}
