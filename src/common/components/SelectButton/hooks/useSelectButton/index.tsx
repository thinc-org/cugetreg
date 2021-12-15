import { runInAction } from 'mobx'

import { useCallback } from 'react'
import toast, { Toast, ToastOptions } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { MdDelete } from 'react-icons/md'

import { SelectButtonToast, ToastTranslationName } from '@/common/components/SelectButtonToast'
import { courseCartStore } from '@/store'

import { SelectButtonProps } from '../../types'

const toastOptions: ToastOptions = {
  style: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
}

let lastToastId = ''

export const useSelectButton = ({ course, selectedSectionNumber, log }: SelectButtonProps) => {
  const { t } = useTranslation('courseCard')
  const isSelected = courseCartStore.item(course)?.selectedSectionNo === selectedSectionNumber

  const createToastRenderer = useCallback((message: ToastTranslationName, action: ToastTranslationName) => {
    let rendered = false
    return function render(t: Toast) {
      if (!rendered) {
        rendered = true
        lastToastId = t.id
      }
      return <SelectButtonToast toastId={t.id} message={message} action={action} />
    }
  }, [])

  const onClickSelectCourse = useCallback(() => {
    runInAction(() => {
      if (lastToastId) {
        toast.dismiss(lastToastId)
      }
      if (!isSelected) {
        const addItemSuccess = courseCartStore.addItem(course, selectedSectionNumber)
        if (!addItemSuccess) {
          log(null, 'addSubjectFailed')
          toast.error(createToastRenderer('addSubjectFailed', 'addSubjectFailedSolution'), toastOptions)
        } else {
          log(null, 'addSubjectSuccess')
          toast.success(createToastRenderer('addSubjectSuccess', 'viewAllSubject'), toastOptions)
        }
      } else {
        courseCartStore.removeCourse(course)
        log(null, 'removeSubjectSuccess')
        toast(createToastRenderer('removeSubjectSuccess', 'viewAllSubject'), {
          ...toastOptions,
          icon: <MdDelete style={{ width: 20, height: 20 }} />,
        })
      }
    })
  }, [course, selectedSectionNumber, isSelected, log, createToastRenderer])

  return {
    t,
    isSelected,
    onClickSelectCourse,
  }
}
