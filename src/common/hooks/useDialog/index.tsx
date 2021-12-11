import dynamic from 'next/dynamic'

import { useState } from 'react'

import { UniversalDialogProps } from '@/common/components/UniversalDialog/types'

import { UseDialog } from './types'

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

export const useDialog = (initialProps?: Omit<UniversalDialogProps, 'open' | 'setOpen'>): UseDialog => {
  const [open, setOpen] = useState(false)
  const [currentProps, setCurrentProps] = useState<Omit<UniversalDialogProps, 'open' | 'setOpen'>>(initialProps ?? {})

  // TODO better way to handle this?
  const Dialog = () => <DynamicUniversalDialog {...currentProps} open={open} setOpen={setOpen} />

  const activate: UseDialog['activate'] = (additionalProps) => {
    setOpen(true)
    setCurrentProps((prevProps) => ({
      ...prevProps,
      ...additionalProps,
    }))
  }

  return { activate, Dialog }
}
