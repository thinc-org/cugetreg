import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as th from './locales/th'

const resources = {
  th,
}

export enum Language {
  th = 'th',
}

declare module 'react-i18next' {
  type DefaultResources = typeof th
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Resources extends DefaultResources {}
}

i18n.use(initReactI18next).init({
  resources,
  lng: Language.th,

  interpolation: {
    escapeValue: false,
  },
})

export default i18n
