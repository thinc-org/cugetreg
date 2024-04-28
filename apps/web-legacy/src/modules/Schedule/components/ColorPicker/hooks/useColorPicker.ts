import { useRef } from 'react'

import { COLOR_BUTTON } from '@web/common/context/Analytics/constants'
import { useLog } from '@web/common/context/Analytics/hooks/useLog'
import { useDisclosure } from '@web/common/hooks/useDisclosure'
import { ScheduleColor } from '@web/modules/Schedule/components/ColorPicker/constants'
import { CourseCartItem, courseCartStore } from '@web/store'

export type ColorClassKey = Pick<
  CourseCartItem,
  'courseNo' | 'studyProgram' | 'academicYear' | 'semester' | 'abbrName' | 'color'
>

export function useColorPicker(classKey: ColorClassKey) {
  const { log } = useLog(COLOR_BUTTON, classKey.courseNo)
  const setColor = (scheduleColor: ScheduleColor) => {
    log(null, scheduleColor)
    courseCartStore.changeColor(classKey, scheduleColor)
  }
  return { setColor, selectedColor: classKey.color }
}

export function useColorPickerPopper(classKey: ColorClassKey) {
  const anchorElRef = useRef<HTMLButtonElement | null>(null)
  const { isOpen, onClose, onToggle } = useDisclosure()
  const colorPickerProps = useColorPicker(classKey)
  return {
    open: isOpen,
    handleClick: onToggle,
    handleClose: onClose,
    anchorElRef,
    ...colorPickerProps,
  }
}
