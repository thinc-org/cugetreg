import { useState } from 'react'

export function useSnackBar() {
  const [message, setMessage] = useState('')
  const [action, setAction] = useState<string | undefined>()
  const [open, setOpen] = useState(false)
  const [isWarning, setisWarning] = useState(false)

  const emitMessage = (messageText: string, actionText?: string, _isWarning?: boolean) => {
    setMessage(messageText)
    setAction(actionText || '')
    setisWarning(_isWarning || false)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
  }

  return { action, emitMessage, message, open, close, isWarning }
}
