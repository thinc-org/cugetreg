import TagManager from 'react-gtm-module'

import { ENABLE_LOGGING, GOOGLE_TAG_MANAGER_CONTAINER_ID } from '@web/env'

import { Consents } from '../types/consents'
import { TrackCustomEventParams } from './types'

class MasterTracker {
  init() {
    TagManager.initialize({ gtmId: GOOGLE_TAG_MANAGER_CONTAINER_ID })
  }

  trackPageView(url: string) {
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageView',
        url: url,
      },
    })
  }

  trackCustomEvent<T = Record<string, never>>({
    event,
    category,
    action,
    label,
    custom,
    screenName,
  }: TrackCustomEventParams<T>) {
    TagManager.dataLayer({
      dataLayer: {
        event,
        category,
        action,
        label,
        screenName,
        custom,
      },
    })
  }

  updateConsents(consents: Consents) {
    TagManager.dataLayer({
      dataLayer: {
        event: 'consentUpdate',
        ...consents,
      },
    })
  }
}

const Tracker = ENABLE_LOGGING ? new MasterTracker() : null

export { Tracker }
