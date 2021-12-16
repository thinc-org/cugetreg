import styled from '@emotion/styled'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { MdUndo } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'

import { AnimatedIconWrapper, ToastAction, ToastLayout, useCurrentToast } from '@/common/components/Toast'
import { CourseCartItem, courseCartStore } from '@/store'

export interface RemoveCourseButtonProps {
  item: CourseCartItem
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
    courseCartStore.removeCourse(item)
    lastToastId = toast(<RemoveCourseToast item={item} />, {
      icon: (
        <AnimatedIconWrapper>
          <DeleteIcon />
        </AnimatedIconWrapper>
      ),
    })
  }, [item])
}

export function RemoveCourseToast({ item }: RemoveCourseButtonProps) {
  const { t } = useTranslation('schedulePage')
  const { dismiss } = useCurrentToast()
  const handleUndo = useCallback(() => {
    courseCartStore.addItem(item, item.selectedSectionNo)
    dismiss()
  }, [item, dismiss])

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
