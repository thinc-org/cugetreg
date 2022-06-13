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
}

export const useConsentsStore = create<ConsentsStoreProps>((set) => {
  const initialConsents = getCookie(CookieKey.CONSENTS) as Consents

  const setOpenBanner = (openBanner: boolean) => {
    set((state) => ({ ...state, openBanner }))
  }

  const setOpenSettings = (openSettings: boolean) => {
    set((state) => ({ ...state, openSettings }))
  }

  const setConsents = (consents: Partial<Consents>) => {
    set((state) => {
      const newConsents = { ...state.consents, ...consents }
      Tracker.updateConsents(newConsents)
      return { ...state, consents: newConsents }
    })
  }

  return {
    consents: initialConsents || {},
    openBanner: !initialConsents,
    openSettings: false,
    setOpenBanner,
    setOpenSettings,
    setConsents,
  }
})
