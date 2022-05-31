import TagManager from 'react-gtm-module'

import { GOOGLE_TAG_MANAGER_CONTAINER_ID, ENABLE_LOGGING } from '@/env'

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

  trackCustomEvent<T = {}>({ event, category, action, label, custom, screenName }: TrackCustomEventParams<T>) {
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
}

class NoOpTracker {
  init() {}

  trackPageView(url: string) {}

  trackCustomEvent<T = {}>({ event, category, action, label, custom, screenName }: TrackCustomEventParams<T>) {}
}

const Tracker = ENABLE_LOGGING ? new MasterTracker() : new NoOpTracker()

export { Tracker }
