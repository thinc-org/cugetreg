import { SetStateAction, Dispatch } from 'react'

export interface LoginGuardDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onClose?: () => void
  onConfirm?: () => void
  onCancel?: () => void
}
