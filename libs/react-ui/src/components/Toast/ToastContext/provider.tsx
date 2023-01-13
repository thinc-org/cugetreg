import { PropsWithChildren, useCallback } from 'react'
import toast, { Toast } from 'react-hot-toast'

import { ToastContext } from '.'

export type ToastContextProviderProps = PropsWithChildren<{
  toast: Toast
}>

export function ToastContextProvider({ toast: t, children }: ToastContextProviderProps) {
  const dismiss = useCallback(() => toast.dismiss(t.id), [t])

  return <ToastContext.Provider value={{ toast: t, dismiss }}>{children}</ToastContext.Provider>
}
