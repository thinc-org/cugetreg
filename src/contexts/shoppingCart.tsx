import { CourseCart } from '@/store'
import { createContext, useContext } from 'react'

export const ShoppingCartContext = createContext(new CourseCart())

export const useShoppingCartContext = () => useContext(ShoppingCartContext)

export const ShoppingCartProvider: React.FC = (props) => {
  return <ShoppingCartContext.Provider value={new CourseCart()} {...props} />
}
