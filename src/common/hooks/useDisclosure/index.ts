import { useCallback, useState } from 'react'

export default function useDisclosure(defaultValue = false) {
  const [isOpen, setOpen] = useState(defaultValue)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])
  const onToggle = useCallback(() => setOpen((isOpen) => !isOpen), [])

  return { isOpen, onOpen, onClose, onToggle }
}
