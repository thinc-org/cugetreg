import { useState } from 'react'

import { INTERACTIVE_SCHEDULE } from '@/common/context/Analytics/constants'
import { useLog } from '@/common/context/Analytics/hooks/useLog'
import { useDisclosure } from '@/common/hooks/useDisclosure'
import { ScheduleClass } from '@/modules/Schedule/components/Schedule/utils'

export function useCourseDialogDisclosure() {
  const [selectedClasssetDialog, setClassDialog] = useState<ScheduleClass | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { log } = useLog(INTERACTIVE_SCHEDULE)
  const handleOpen = (scheduleClass: ScheduleClass) => {
    setClassDialog(scheduleClass)
    log(null, scheduleClass.courseNo)
    onOpen()
  }
  const onRemove = () => setClassDialog(null)
  return { open: isOpen, selectedClasssetDialog, onClose, onOpen: handleOpen, onRemove }
}
