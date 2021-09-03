import { useCallback, useState } from 'react'

interface UseDisclosureProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

export function useDisclosure(defaultValue = false): UseDisclosureProps {
  const [isOpen, setOpen] = useState(defaultValue)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])
  const onToggle = useCallback(() => setOpen((isOpen) => !isOpen), [])

  return { isOpen, onOpen, onClose, onToggle }
}
