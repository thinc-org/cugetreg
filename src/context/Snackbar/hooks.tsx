import { useState } from 'react'

export function useSnackBar() {
  const [message, setMessage] = useState('')
  const [action, setAction] = useState<string | undefined>()
  const [open, setOpen] = useState(false)

  const emitMessage = (messageText: string, actionText?: string) => {
    setMessage(messageText)
    setAction(actionText || '')
    setOpen(true)
  }

  return { action, emitMessage, message, open }
}
