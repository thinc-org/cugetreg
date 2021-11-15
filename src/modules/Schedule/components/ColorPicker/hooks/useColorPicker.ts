import { useState } from 'react'

import { COLOR_BUTTON } from '@/common/context/Analytics/constants'
import { useLog } from '@/common/context/Analytics/hooks/useLog'
import { ScheduleColor } from '@/modules/Schedule/components/ColorPicker/constants'
import { CourseCartItem, courseCartStore } from '@/store'

export type ColorClassKey = Pick<
  CourseCartItem,
  'courseNo' | 'studyProgram' | 'academicYear' | 'semester' | 'abbrName' | 'color'
>

export function useColorPicker(classKey: ColorClassKey) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const open = !!anchorEl
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { log } = useLog(COLOR_BUTTON, classKey.courseNo)
  const setColor = (scheduleColor: ScheduleColor) => {
    log(null, scheduleColor)
    courseCartStore.changeColor(classKey, scheduleColor)
  }
  return { open, handleClick, handleClose, anchorEl, setColor, selectedColor: classKey.color }
}
