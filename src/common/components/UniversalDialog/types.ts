import { ButtonProps, DialogProps } from '@mui/material'

import { SetStateAction, Dispatch } from 'react'

export interface UniversalDialogProps extends DialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  heading?: string
  content?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  primaryButtonProps?: Omit<ButtonProps, 'children' | 'onClick'>
  secondaryButtonProps?: Omit<ButtonProps, 'children' | 'onClick'>
  onClose?: () => void
  onConfirm?: () => void
  onCancel?: () => void
}
