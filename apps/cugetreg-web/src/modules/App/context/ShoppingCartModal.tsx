import { ShoppingCartModalProvider } from '@web/common/context/ShoppingCartModal'
import { useDisclosure } from '@web/common/hooks/useDisclosure'

interface ShoppingCartModalProviderProps {
  children: React.ReactNode
}

export const ShoppingCartModalContextProvider = ({ children }: ShoppingCartModalProviderProps) => {
  const disclosureValue = useDisclosure()
  return <ShoppingCartModalProvider value={disclosureValue}>{children}</ShoppingCartModalProvider>
}
