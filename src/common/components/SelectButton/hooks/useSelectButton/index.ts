import useGoogleOptimize from '@react-hook/google-optimize'
import { runInAction } from 'mobx'
import { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarContext } from '@/common/context/Snackbar'
import { courseCartStore } from '@/store'
import { google_optimize } from '@/utils/env'

import { SelectButtonProps } from '../../types'

export const useSelectButton = ({ course, selectedSectionNumber, log }: SelectButtonProps) => {
  const { t } = useTranslation('courseCard')
  const { emitMessage } = useContext(SnackbarContext)
  const isExperimentColor = useGoogleOptimize(google_optimize, [false, true])

  const isSelected = courseCartStore.item(course)?.selectedSectionNo === selectedSectionNumber

  const onClickSelectCourse = useCallback(() => {
    runInAction(() => {
      if (!isSelected) {
        const addItemSuccess = courseCartStore.addItem(course, selectedSectionNumber)
        if (!addItemSuccess) {
          log(null, 'addSubjectFailed')
          emitMessage(t('addSubjectFailed'), 'error', t('addSubjectFailedSolution'))
        } else {
          log(null, 'addSubjectSuccess')
          emitMessage(t('addSubjectSuccess'), 'success', t('viewAllSubject'))
        }
      } else {
        courseCartStore.removeCourse(course)
        log(null, 'removeSubjectSuccess')
        emitMessage(t('removeSubjectSuccess'), 'warning', t('viewAllSubject'))
      }
    })
  }, [course, selectedSectionNumber, isSelected, emitMessage, t, log])

  return {
    t,
    isSelected,
    onClickSelectCourse,
    isExperimentColor,
  }
}
