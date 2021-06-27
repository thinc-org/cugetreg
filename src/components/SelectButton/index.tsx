import { CustomButton } from '@/components/common/CustomButton'
import { courseCartStore } from '@/store'
import { Add } from '@material-ui/icons'
import { Course } from '@thinc-org/chula-courses'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { MdCheck } from 'react-icons/md'
import { useContext } from 'react'
import { SnackbarContext } from '@/context/Snackbar'

interface SelectButtonProps {
  course: Course
  selectedSectionNumber: string
}

export const SelectButton = observer(({ course, selectedSectionNumber }: SelectButtonProps) => {
  const { t } = useTranslation('courseCard')
  const { emitMessage } = useContext(SnackbarContext)

  const isSelected = courseCartStore.item(course.courseNo)?.selectedSectionNo === selectedSectionNumber

  const onClickSelectCourse = useCallback(() => {
    runInAction(() => {
      if (!isSelected) {
        const addItemSuccess = courseCartStore.addItem(course, selectedSectionNumber)
        if (!addItemSuccess) {
          emitMessage(t('addSubjectFailed'), 'error', t('addSubjectFailedSolution'))
        } else {
          emitMessage(t('addSubjectSuccess'), 'success', t('viewAllSubject'))
        }
      } else {
        courseCartStore.removeCourse(course)
        emitMessage(t('removeSubjectSuccess'), 'warning', t('viewAllSubject'))
      }
    })
  }, [course, selectedSectionNumber, isSelected, emitMessage, t])

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
