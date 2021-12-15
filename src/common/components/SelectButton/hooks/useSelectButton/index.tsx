import { runInAction } from 'mobx'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { MdDelete } from 'react-icons/md'

import { SelectButtonToast } from '@/common/components/SelectButtonToast'
import { courseCartStore } from '@/store'

import { SelectButtonProps } from '../../types'

let lastToastId = ''

export const useSelectButton = ({ course, selectedSectionNumber, log }: SelectButtonProps) => {
  const { t } = useTranslation('courseCard')
  const isSelected = courseCartStore.item(course)?.selectedSectionNo === selectedSectionNumber

  const onClickSelectCourse = useCallback(() => {
    runInAction(() => {
      if (lastToastId) {
        toast.dismiss(lastToastId)
      }
      if (!isSelected) {
        const addItemSuccess = courseCartStore.addItem(course, selectedSectionNumber)
        if (!addItemSuccess) {
          log(null, 'addSubjectFailed')
          lastToastId = toast.error(<SelectButtonToast message="addSubjectFailed" action="addSubjectFailedSolution" />)
        } else {
          log(null, 'addSubjectSuccess')
          lastToastId = toast.success(<SelectButtonToast message="addSubjectSuccess" action="viewAllSubject" />)
        }
      } else {
        courseCartStore.removeCourse(course)
        log(null, 'removeSubjectSuccess')
        lastToastId = toast(<SelectButtonToast message="removeSubjectSuccess" action="viewAllSubject" />, {
          icon: <MdDelete style={{ width: 20, height: 20 }} />,
        })
      }
    })
  }, [course, selectedSectionNumber, isSelected, log])

  return {
    t,
    isSelected,
    onClickSelectCourse,
  }
}
