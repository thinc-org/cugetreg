import { CustomButton } from '@/components/common/CustomButton'
import { courseCartStore } from '@/store'
import { Add } from '@material-ui/icons'
import { Course } from '@thinc-org/chula-courses'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ImCheckmark } from 'react-icons/im'
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
    emitMessage('เพิ่มรายวิชาสำเร็จ', 'ดูวิชาทั้งหมด')
    runInAction(() => {
      if (!isSelected) courseCartStore.addItem(course, selectedSectionNumber)
      else courseCartStore.removeCourse(course)
    })
  }, [course, selectedSectionNumber, isSelected, emitMessage])

  return (
    <CustomButton
      loading={false}
      startIcon={!isSelected ? <Add /> : <ImCheckmark />}
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
