import { getCookie, setCookies } from 'cookies-next'
import create from 'zustand'

import { CookieKey } from '@web/common/constants/cookie'
import { Tracker } from '@web/common/tracker'
import { Consents } from '@web/common/types/consents'

interface ConsentsStoreProps {
  consents: Consents
  bannerOpen: boolean
  settingsOpen: boolean
  setBannerOpen: (bannerOpen: boolean) => void
  setSettingsOpen: (settingsOpen: boolean) => void
  setConsents: (consents: Consents) => void
  submitConsents: (consents?: Consents) => void
}

export const useConsentsStore = create<ConsentsStoreProps>((set, get) => {
  const initialConsents = JSON.parse((getCookie(CookieKey.CONSENTS) as string) ?? '{}') as Consents

  const setBannerOpen = (bannerOpen: boolean) => {
    set((state) => ({ ...state, bannerOpen }))
  }

  const setSettingsOpen = (settingsOpen: boolean) => {
    set((state) => ({ ...state, settingsOpen }))
  }

  const setConsents = (consents: Partial<Consents>) => {
    set((state) => {
      const newConsents = { ...state.consents, ...consents }
      return { ...state, consents: newConsents }
    })
  }

  const submitConsents = (consents?: Consents) => {
    const c = consents ? consents : get().consents
    Tracker?.updateConsents(c)
    setCookies(CookieKey.CONSENTS, JSON.stringify(c), { maxAge: 365 * 24 * 60 * 60 }) // 1 year
  }

  return {
    consents: initialConsents || {},
    bannerOpen: !Object.keys(initialConsents).length,
    settingsOpen: false,
    setBannerOpen,
    setSettingsOpen,
    setConsents,
    submitConsents,
  }
})
