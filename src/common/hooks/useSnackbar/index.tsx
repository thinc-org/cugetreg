import { Color } from '@material-ui/core/Alert'
import { useState } from 'react'

export function useSnackBar() {
  const [message, setMessage] = useState('')
  const [action, setAction] = useState<string | undefined>()
  const [open, setOpen] = useState(false)
  const [messageType, setMessageType] = useState<Color>('success')

  const emitMessage = (messageText: string, type: Color, actionText?: string) => {
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
