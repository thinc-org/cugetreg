import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import * as th from './locales/th'

const resources = {
  th,
} as const

export enum Language {
  th = 'th',
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['th']
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: Language.th,

  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
