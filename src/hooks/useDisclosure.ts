import { useState } from 'react'

export function useDisclosure(defaultValue = false) {
  const [isOpen, setOpen] = useState(defaultValue)
  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)
  const onToggle = () => setOpen((isOpen) => !isOpen)
  return { isOpen, onOpen, onClose, onToggle }
}
