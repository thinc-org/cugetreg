import { Color } from '@material-ui/core/Alert'
import { useState } from 'react'
import { SnackbarProps } from './types'

export function useSnackBar() {
  const [message, setMessage] = useState('')
  const [action, setAction] = useState<string | undefined>()
  const [open, setOpen] = useState(false)
  const [messageType, setMessageType] = useState<Color>('success')

  const emitMessage: SnackbarProps['emitMessage'] = (messageText, type, actionText) => {
    setMessage(messageText)
    setAction(actionText || '')
    setMessageType(type)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
  }

  return { action, emitMessage, message, open, close, messageType }
}
