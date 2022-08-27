import { useState } from 'react'

import { INTERACTIVE_SCHEDULE } from '@web/common/context/Analytics/constants'
import { useLog } from '@web/common/context/Analytics/hooks/useLog'
import { useDisclosure } from '@web/common/hooks/useDisclosure'
import { ScheduleClass } from '@web/modules/Schedule/components/Schedule/utils'

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
