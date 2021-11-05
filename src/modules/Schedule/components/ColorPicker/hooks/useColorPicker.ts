import { useState } from 'react'

import { ScheduleColor } from '@/modules/Schedule/components/ColorPicker/constants'
import { ScheduleClass } from '@/modules/Schedule/components/Schedule/utils'
import { courseCartStore } from '@/store'

export function useColorPicker(scheduleClass: ScheduleClass) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const open = !!anchorEl
  const handleClose = () => {
    setAnchorEl(null)
  }

  console.log(scheduleClass)

  const setColor = (scheduleColor: ScheduleColor) => {
    console.log('set color ', scheduleColor)

    courseCartStore.changeColor(scheduleClass, scheduleColor)
  }
  return { open, handleClick, handleClose, anchorEl, setColor, selectedColor: scheduleClass.color }
}
