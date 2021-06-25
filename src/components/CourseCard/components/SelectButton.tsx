import { CustomButton } from '@/components/common/CustomButton'
import { courseCartStore } from '@/store'
import { Add } from '@material-ui/icons'
import { Course } from '@thinc-org/chula-courses'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ImCheckmark } from 'react-icons/im'
import { useCourseCardContext } from '../useCourseCard'

interface SelectButtonProps {
  course: Course
}

export const SelectButton = observer(({ course }: SelectButtonProps) => {
  const { t } = useTranslation('courseCard')

  const { selectedSectionNumber } = useCourseCardContext()
  const isSelected = courseCartStore.item(course.courseNo)?.selectedSectionNo === selectedSectionNumber

  const onClickSelectCourse = useCallback(
    () =>
      runInAction(() => {
        if (!isSelected) courseCartStore.addItem(course, selectedSectionNumber)
        else courseCartStore.removeCourse(course)
      }),
    [course, selectedSectionNumber, isSelected]
  )

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
