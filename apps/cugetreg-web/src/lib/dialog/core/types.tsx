import { ButtonProps } from '@lib/react-ui'
import { DialogProps as MuiDialogProps } from '@mui/material'

export interface DialogOptions {
  id?: string
  heading?: string
  content?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  onPrimaryButtonClick?: () => void
  onSecondaryButtonClick?: () => void
  primaryButtonProps?: Pick<ButtonProps, 'variant' | 'color' | 'size'>
  secondaryButtonProps?: Pick<ButtonProps, 'variant' | 'color' | 'size'>
}

export interface DialogProps extends DialogOptions, Omit<MuiDialogProps, 'open'> {
  id: string
  createdAt: number
  ariaProps: {
    role: string
  }
}

export interface DialogState {
  dialogs: DialogProps[]
}

export const DialogActionType = {
  ADD_DIALOG: 'ADD_DIALOG',
  REMOVE_DIALOG: 'REMOVE_DIALOG',
  UPDATE_DIALOG: 'UPDATE_DIALOG',
} as const
export type DialogActionType = ValueOf<typeof DialogActionType>

export type DialogAction =
  | {
      type: 'ADD_DIALOG'
      payload: { dialog: DialogProps }
    }
  | {
      type: 'REMOVE_DIALOG'
      payload: { id: string }
    }
  | {
      type: 'UPDATE_DIALOG'
      payload: { dialog: DialogProps }
    }
