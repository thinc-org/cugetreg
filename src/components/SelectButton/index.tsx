import Add from '@material-ui/icons/Add'
import { Course } from '@thinc-org/chula-courses'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { MdCheck } from 'react-icons/md'

import { CustomButton } from '@/components/common/CustomButton'
import { SnackbarContext } from '@/context/Snackbar'
import { courseCartStore } from '@/store'

interface SelectButtonProps {
  course: Course
  selectedSectionNumber: string
  log: (_?: unknown, value?: string) => void
}

export const SelectButton = observer(({ course, selectedSectionNumber, log }: SelectButtonProps) => {
  const { t } = useTranslation('courseCard')
  const { emitMessage } = useContext(SnackbarContext)

  const isSelected = courseCartStore.item(course.courseNo)?.selectedSectionNo === selectedSectionNumber

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

  return (
    <CustomButton
      loading={false}
      startIcon={!isSelected ? <Add /> : <MdCheck />}
      color="primary"
      variant={!isSelected ? 'contained' : 'outlined'}
      fullWidth
      disableElevation
      onClick={onClickSelectCourse}
    >
      {t('select')}
    </CustomButton>
  )
})
