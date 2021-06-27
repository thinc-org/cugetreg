export interface SnackbarProps {
  message: string
  action?: string
  emitMessage: (messageText: string, actiontText?: string, isWarning?: boolean) => void
}
