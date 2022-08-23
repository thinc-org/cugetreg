import { useEffect, useState } from 'react'

import { DialogAction, DialogActionType, DialogOptions, DialogProps, DialogState } from './types'

let memoryState: DialogState = { dialogs: [] }
const listeners: Array<(state: DialogState) => void> = []

const mergeDialogOptions = (dialog: DialogProps, newDialogOptions: DialogOptions): DialogProps => {
  return {
    ...dialog,
    ...newDialogOptions,
    primaryButtonProps: { ...dialog.primaryButtonProps, ...newDialogOptions.primaryButtonProps },
    secondaryButtonProps: {
      ...dialog.secondaryButtonProps,
      ...newDialogOptions.secondaryButtonProps,
    },
  }
}

export const reducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case DialogActionType.ADD_DIALOG:
      return {
        ...state,
        dialogs: [...state.dialogs, action.payload.dialog],
      }
    case DialogActionType.REMOVE_DIALOG:
      return {
        ...state,
        dialogs: state.dialogs.filter((dialog) => dialog.id !== action.payload.id),
      }
    case DialogActionType.UPDATE_DIALOG: {
      const incommingProps = action.payload.dialog
      const updatedDialogs = state.dialogs.map((dialog) =>
        dialog.id !== incommingProps.id ? dialog : mergeDialogOptions(dialog, incommingProps)
      )
      return {
        ...state,
        dialogs: updatedDialogs,
      }
    }
    default:
      return state
  }
}

export const dispatch = (action: DialogAction) => {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

export const useStore = (dialogOptions: DialogOptions): DialogState => {
  const [state, setState] = useState<DialogState>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  const mergedDialogs = state.dialogs.map((dialog) => mergeDialogOptions(dialog, dialogOptions))

  return {
    ...state,
    dialogs: mergedDialogs,
  }
}
