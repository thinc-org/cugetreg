import { useTheme } from '@emotion/react'
import { Dialog, Slide, useMediaQuery } from '@material-ui/core'
import { SlideProps } from '@material-ui/core'
import { ForwardedRef, forwardRef, useContext } from 'react'

import ShoppingPanel from '@/components/ShoppingPanel'
import { ShoppingCartModalContext } from '@/context/ShoppingCartModal'

const Transition = forwardRef((props: SlideProps, ref: ForwardedRef<unknown>) => {
  return <Slide direction="up" ref={ref} {...props} />
})

export function ShoppingCartModal() {
  const { isOpen, onClose } = useContext(ShoppingCartModalContext)

  const theme = useTheme()
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      scroll="body"
      TransitionComponent={isSm ? Transition : undefined}
      sx={{
        '& .MuiDialog-paperScrollBody': {
          verticalAlign: ['bottom', 'middle'],
          m: [2, 4],
          width: (theme) => [`calc(100% - ${theme.spacing(4)})`, `calc(100% - ${theme.spacing(8)})`],
          maxWidth: (theme) => [`calc(100% - ${theme.spacing(4)})`, theme.breakpoints.values.sm],
        },
      }}
    >
      <ShoppingPanel />
    </Dialog>
  )
}
