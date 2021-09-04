import { Color } from '@material-ui/core/Alert'

export interface SnackbarProps {
  message: string
  action?: string
  emitMessage: (messageText: string, type: Color, actiontText?: string) => void
}
