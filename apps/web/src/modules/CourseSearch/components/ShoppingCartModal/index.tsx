import { ResponsiveDialog } from '@web/common/components/ResponsiveDialog'
import { useShoppingCardModal } from '@web/common/context/ShoppingCartModal'

import { ShoppingPanel } from './components/ShoppingPanel'

export function ShoppingCartModal() {
  const { isOpen, onClose } = useShoppingCardModal()
  return (
    <ResponsiveDialog open={isOpen} onClose={onClose} fullWidth>
      <ShoppingPanel />
    </ResponsiveDialog>
  )
}
