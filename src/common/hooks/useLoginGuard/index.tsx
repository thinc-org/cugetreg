import dynamic from 'next/dynamic'

import { useState } from 'react'

import { UniversalDialogProps } from '@/common/components/UniversalDialog/types'
import { userStore } from '@/store/userStore'

const DynamicUniversalDialog = dynamic(
  async () =>
    (
      await import(
        /* webpackChunkName: "UniversalDialog" */
        '@/common/components/UniversalDialog'
      )
    ).UniversalDialog,
  {
    ssr: false,
  }
)

export const useLoginGuard = () => {
  const [open, setOpen] = useState(false)
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(() => () => {})

  // TODO better way to handle this?
  const Dialog = () => (
    <DynamicUniversalDialog
      open={open}
      setOpen={setOpen}
      heading="คุณยังไม่ได้เข้าสู่ระบบ"
      content="คุณจะสามารถเขียนรีวิว กดไลก์ และรายงานรีวิวของผู้อื่นได้เมื่อเข้าสู่ระบบแล้วเท่านั้น"
      primaryButtonText="เข้าสู่ระบบ"
      secondaryButtonText="ยกเลิก"
      onConfirm={() => {
        onConfirm?.()
        userStore.login()
      }}
    />
  )

  const loginGuard = (onConfirm?: UniversalDialogProps['onConfirm']) => {
    if (!userStore.isLoggedIn()) {
      setOpen(true)
      setOnConfirm(() => onConfirm)
      return false
    }
    return true
  }

  return { loginGuard, Dialog }
}
