import { ResponsiveDialog } from '@/common/components/ResponsiveDialog'
import { useShoppingCardModal } from '@/context/ShoppingCartModal'
import ShoppingPanel from '@/modules/CourseSearch/component/ShoppingCartModal/components/ShoppingPanel'

export function ShoppingCartModal() {
  const { isOpen, onClose } = useShoppingCardModal()
  return (
    <ResponsiveDialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      sx={{
        '&& .MuiDialog-paperScrollBody': {
          m: [2, 4],
          width: (theme) => [`calc(100% - ${theme.spacing(4)})`, `calc(100% - ${theme.spacing(8)})`],
          maxWidth: (theme) => [`calc(100% - ${theme.spacing(4)})`, theme.breakpoints.values.sm],
        },
      }}
    >
      <ShoppingPanel />
    </ResponsiveDialog>
  )
}
