import React, { createContext, useContext } from 'react'

import { ModalProps } from './types'

export const ShoppingCartModalContext = createContext({} as ModalProps)

export const useShoppingCardModal = () => useContext(ShoppingCartModalContext)

export const ShoppingCartModalProvider = (props: { value: ModalProps; children: React.ReactNode }) => {
  return <ShoppingCartModalContext.Provider {...props} />
}
