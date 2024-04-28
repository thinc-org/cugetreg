import { useMemo } from 'react'

import { useStore } from './store'
import { dispatch } from './store'
import { DialogActionType, DialogOptions } from './types'

export const useDialog = (dialogOptions: DialogOptions) => {
  const { dialogs } = useStore(dialogOptions)

  const handlers = useMemo(
    () => ({
      close: (id: string) => {
        dispatch({ type: DialogActionType.REMOVE_DIALOG, payload: { id } })
      },
    }),
    []
  )

  return {
    dialogs,
    handlers,
  }
}
