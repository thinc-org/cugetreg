import { createContext, useContext } from 'react'
import { Toast } from 'react-hot-toast'

export interface ToastContextValue {
  toast: Toast
  dismiss: () => void
}

export const ToastContext = createContext<ToastContextValue>(null as unknown as ToastContextValue)

export function useCurrentToast() {
  return useContext(ToastContext)
}

export * from './provider'
