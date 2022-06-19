import { getCookie } from 'cookies-next'
import create from 'zustand'

import { CookieKey } from '@/common/constants/cookie'
import { Tracker } from '@/common/tracker'
import { Consents } from '@/common/types/consents'

interface ConsentsStoreProps {
  consents: Consents
  openBanner: boolean
  openSettings: boolean
  setOpenBanner: (openBanner: boolean) => void
  setOpenSettings: (openSettings: boolean) => void
  setConsents: (consents: Consents) => void
  submitConsents: () => void
}

export const useConsentsStore = create<ConsentsStoreProps>((set, get) => {
  const initialConsents = JSON.parse((getCookie(CookieKey.CONSENTS) as string) ?? '{}') as Consents

  const setOpenBanner = (openBanner: boolean) => {
    set((state) => ({ ...state, openBanner }))
  }

  const setOpenSettings = (openSettings: boolean) => {
    set((state) => ({ ...state, openSettings }))
  }

  const setConsents = (consents: Partial<Consents>) => {
    set((state) => {
      const newConsents = { ...state.consents, ...consents }
      return { ...state, consents: newConsents }
    })
  }

  const submitConsents = () => {
    Tracker.updateConsents(get().consents)
  }

  return {
    consents: initialConsents || {},
    openBanner: !Object.keys(initialConsents).length,
    openSettings: false,
    setOpenBanner,
    setOpenSettings,
    setConsents,
    submitConsents,
  }
})
