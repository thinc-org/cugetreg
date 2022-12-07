import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { MdUndo } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'

import { styled } from '@mui/material'

import {
  AnimatedIconWrapper,
  ToastAction,
  ToastLayout,
  useCurrentToast,
} from '@web/common/components/Toast'
import { CourseCartItem, courseCartStore, isSameKey } from '@web/store'

interface RemoveCourseToastProps {
  item: CourseCartItem
  index: number
}

let lastToastId = ''

const DeleteIcon = styled(MdDelete)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.palette.highlight.red[500]};
`

export function useRemoveCourse(item: CourseCartItem) {
  return useCallback(() => {
    if (lastToastId) {
      toast.dismiss(lastToastId)
    }
    const items = courseCartStore.shopItemsByCourseGroup(item)
    const index = items.findIndex((i) => isSameKey(i, item))
    if (index === -1) return
    courseCartStore.removeCourse(item)
    lastToastId = toast(<RemoveCourseToast item={item} index={index} />, {
      icon: (
        <AnimatedIconWrapper>
          <DeleteIcon />
        </AnimatedIconWrapper>
      ),
    })
  }, [item])
}

export function RemoveCourseToast({ item, index }: RemoveCourseToastProps) {
  const { t } = useTranslation('schedulePage')
  const { dismiss } = useCurrentToast()

  const handleUndo = useCallback(() => {
    const items = courseCartStore.shopItemsByCourseGroup(item)
    if (items.some((i) => isSameKey(i, item))) return
    courseCartStore.addItem(item, item.selectedSectionNo, false)
    courseCartStore.reorder(item, items.length, index)
    dismiss()
  }, [item, index, dismiss])

  return (
    <ToastLayout
      actions={
        <ToastAction onClick={handleUndo}>
          <MdUndo />
        </ToastAction>
      }
    >
      {t('removeSubjectSuccess')}
    </ToastLayout>
  )
}
