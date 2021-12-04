import dynamic from 'next/dynamic'
import { useState } from 'react'

import { LoginGuardDialogProps } from '@/common/components/LoginGuardDialog/types'
import { userStore } from '@/store/userStore'

const LoginGuardDialog = dynamic(async () => (await import('@/common/components/LoginGuardDialog')).LoginGuardDialog, {
  ssr: false,
})

export const useLoginGuard = () => {
  const [open, setOpen] = useState(false)
  const [onConfirm, setOnConfirm] = useState(() => () => {})

  // TODO better way to handle this?
  const Dialog = () => (
    <LoginGuardDialog
      open={open}
      setOpen={setOpen}
      onConfirm={() => {
        onConfirm()
        userStore.login()
      }}
    />
  )

  const loginGuard = (onConfirm?: LoginGuardDialogProps['onConfirm']) => {
    if (!userStore.isLoggedIn()) {
      setOpen(true)
      setOnConfirm(() => onConfirm)
      return false
    }
    return true
  }

  return { loginGuard, Dialog }
}
