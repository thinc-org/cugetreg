import { ShoppingCartStore } from '@/store'
import { createContext, useContext } from 'react'

export const ShoppingCartContext = createContext(new ShoppingCartStore())

export const useShoppingCartContext = () => useContext(ShoppingCartContext)

export const ShoppingCartProvider: React.FC = (props) => {
  return <ShoppingCartContext.Provider value={new ShoppingCartStore()} {...props} />
}
