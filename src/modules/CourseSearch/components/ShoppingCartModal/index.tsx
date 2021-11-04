import { ResponsiveDialog } from '@/common/components/ResponsiveDialog'
import { useShoppingCardModal } from '@/common/context/ShoppingCartModal'

import { ShoppingPanel } from './components/ShoppingPanel'

export function ShoppingCartModal() {
  const { isOpen, onClose } = useShoppingCardModal()
  return (
    <ResponsiveDialog open={isOpen} onClose={onClose} fullWidth>
      <ShoppingPanel />
    </ResponsiveDialog>
  )
}
