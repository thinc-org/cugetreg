import TagManager from 'react-gtm-module'

import { env } from '@/env'

import { TrackCustomEventParams } from './types'

class MasterTracker {
  init() {
    TagManager.initialize({ gtmId: env.googleTagManager.containerId })
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

const Tracker = new MasterTracker()

export { Tracker }
