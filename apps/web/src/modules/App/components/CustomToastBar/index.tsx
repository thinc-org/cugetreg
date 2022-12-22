import { ToastBar, resolveValue } from 'react-hot-toast'

import { styled } from '@mui/material'

import { ToastLayout, useCurrentToast } from '@libs/react-ui'

const Message = styled('div')`
  display: flex;
`

export function CustomToastBar() {
  const { toast } = useCurrentToast()
  const message = resolveValue(toast.message, toast)
  const toastLayout = typeof message === 'string' ? <ToastLayout>{message}</ToastLayout> : message
  const messageElem = <Message {...toast.ariaProps}>{toastLayout}</Message>

  return (
    <ToastBar toast={toast}>
      {({ icon }) => (
        <>
          {icon}
          {messageElem}
        </>
      )}
    </ToastBar>
  )
}
