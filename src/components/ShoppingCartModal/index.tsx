import { useTheme } from '@emotion/react'
import { Dialog, Slide, useMediaQuery, makeStyles } from '@material-ui/core'
import { SlideProps } from '@material-ui/core'
import { ForwardedRef, forwardRef, useContext } from 'react'

import ShoppingPanel from '@/components/ShoppingPanel'
import { ShoppingCartModalContext } from '@/context/ShoppingCartModal'

const Transition = forwardRef((props: SlideProps, ref: ForwardedRef<unknown>) => {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down('sm')]: {
    topPaperScrollBody: {
      verticalAlign: 'bottom',
    },
  },
}))

export function ShoppingCartModal() {
  const classes = useStyles()
  const { isOpen, onClose } = useContext(ShoppingCartModalContext)

  const theme = useTheme()
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      classes={{
        paperScrollBody: classes.topPaperScrollBody,
      }}
      open={isOpen}
      onClose={onClose}
      fullWidth
      scroll="body"
      TransitionComponent={isSm ? Transition : undefined}
    >
      <ShoppingPanel />
    </Dialog>
  )
}
