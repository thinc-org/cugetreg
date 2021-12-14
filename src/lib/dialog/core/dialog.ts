import { v4 as uuidv4 } from 'uuid'

import { dispatch } from './store'
import { DialogOptions, DialogProps, DialogActionType } from './types'

const createDialog = (options?: DialogOptions): DialogProps => ({
  createdAt: Date.now(),
  primaryButtonText: 'OK',
  ...options,
  ariaProps: {
    role: 'dialog',
  },
  id: options?.id || uuidv4(),
})

const createHandler = () => (options?: DialogOptions) => {
  const dialog = createDialog(options)
  dispatch({ type: DialogActionType.ADD_DIALOG, payload: { dialog } })
  return dialog.id
}

const dialog = (options?: DialogOptions) => {
  return createHandler()(options)
}

export { dialog }
