import React, { createContext } from 'react'

import { ModalProps } from './types'

export const ShoppingCartModalContext = createContext({} as ModalProps)

export const ShoppingCartModalProvider = (props: { value: ModalProps; children: React.ReactNode }) => {
  return <ShoppingCartModalContext.Provider {...props} />
}
