import { useRef } from 'react'

import { COLOR_BUTTON } from '@/common/context/Analytics/constants'
import { useLog } from '@/common/context/Analytics/hooks/useLog'
import { useDisclosure } from '@/common/hooks/useDisclosure'
import { ScheduleColor } from '@/modules/Schedule/components/ColorPicker/constants'
import { CourseCartItem, courseCartStore } from '@/store'

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
  return { open: isOpen, handleClick: onToggle, handleClose: onClose, anchorElRef, ...colorPickerProps }
}
