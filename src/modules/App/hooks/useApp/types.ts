import { Color } from '@material-ui/core/Alert'

export interface UseAppProps {
  open: boolean
  message: string
  action?: string
  emitMessage: (messageText: string, type: Color, actiontText?: string) => void
  handleClose: (_: unknown, reason: string) => void
  messageType: Color
  actionText?: string
}
