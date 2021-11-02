import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { userStore } from '@/store/userStore'

const LoginGuardDialog = dynamic(async () => (await import('@/common/components/LoginGuardDialog')).LoginGuardDialog, {
  ssr: false,
})

export const useLoginGuard = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const Dialog = () => <LoginGuardDialog open={open} setOpen={setOpen} onConfirm={() => userStore.login(router)} />

  const isLoggedIn = () => {
    if (!userStore.isLoggedIn()) {
      setOpen(true)
      return false
    }
    return true
  }

  return { isLoggedIn, Dialog }
}
