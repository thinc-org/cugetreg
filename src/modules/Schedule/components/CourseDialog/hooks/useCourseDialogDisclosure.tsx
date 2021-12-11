import { useState } from 'react'

import { useDisclosure } from '@/common/hooks/useDisclosure'
import { ScheduleClass } from '@/modules/Schedule/components/Schedule/utils'

export function useCourseDialogDisclosure() {
  const [selectedClasssetDialog, setClassDialog] = useState<ScheduleClass | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleOpen = (scheduleClass: ScheduleClass) => {
    setClassDialog(scheduleClass)
    onOpen()
  }
  const onRemove = () => setClassDialog(null)
  return { open: isOpen, selectedClasssetDialog, onClose, onOpen: handleOpen, onRemove }
}
