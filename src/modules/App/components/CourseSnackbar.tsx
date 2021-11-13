import { Button, Snackbar } from '@mui/material'
import { useContext } from 'react'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SNACKBAR_BUTTON } from '@/common/context/Analytics/constants'
import { useShoppingCardModal } from '@/common/context/ShoppingCartModal'
import { SnackbarContext } from '@/common/context/Snackbar'

import { ToastAlert } from './styled'

export const CourseSnackbar = () => {
  const snackbar = useContext(SnackbarContext)
  const { onOpen } = useShoppingCardModal()
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={snackbar.handleClose}
      autoHideDuration={3000}
      open={snackbar.open}
      style={{ top: '60px' }}
    >
      <ToastAlert
        severity={snackbar.messageType}
        action={
          snackbar.action ? (
            <Analytics elementName={SNACKBAR_BUTTON}>
              {({ log }) => (
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => {
                    log(null, snackbar.message)
                    snackbar.close()
                    onOpen()
                  }}
                >
                  {snackbar.action}
                </Button>
              )}
            </Analytics>
          ) : null
        }
      >
        {snackbar.message}
      </ToastAlert>
    </Snackbar>
  )
}
