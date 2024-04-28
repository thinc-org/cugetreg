import { useState } from 'react'

import { AlertColor } from '@mui/material/Alert'

export function useSnackBar() {
  const [message, setMessage] = useState('')
  const [action, setAction] = useState<string | undefined>()
  const [open, setOpen] = useState(false)
  const [messageType, setMessageType] = useState<AlertColor>('success')

  const emitMessage = (messageText: string, type: AlertColor, actionText?: string) => {
    setMessage(messageText)
    setAction(actionText || '')
    setMessageType(type)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
  }

  const handleClose = (_: unknown, reason: string) => {
    if (reason === 'clickaway') return
    close()
  }

  return { action, emitMessage, message, open, close, messageType, handleClose }
}
