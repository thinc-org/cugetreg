import styled from '@emotion/styled'

import { resolveValue, ToastBar } from 'react-hot-toast'

import { ToastLayout, useCurrentToast } from '@/common/components/Toast'

const Message = styled.div`
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
