import { ShoppingCartModalProvider } from '@/common/context/ShoppingCartModal'
import { useDisclosure } from '@/common/hooks/useDisclosure'

interface ShoppingCartModalProviderProps {
  children: React.ReactNode
}

export const ShoppingCartModalContextProvider = ({ children }: ShoppingCartModalProviderProps) => {
  const disclosureValue = useDisclosure()
  return <ShoppingCartModalProvider value={disclosureValue}>{children}</ShoppingCartModalProvider>
}
