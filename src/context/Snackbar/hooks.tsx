import { useState } from 'react'
import { SnackbarProps } from './types'

export function useSnackBar() {
  const [message, setMessage] = useState('')
  const [action, setAction] = useState<string | undefined>()
  const [open, setOpen] = useState(false)
  const [isWarning, setisWarning] = useState(false)

  const emitMessage: SnackbarProps['emitMessage'] = (messageText, actionText, _isWarning) => {
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
