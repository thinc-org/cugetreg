import TagManager from 'react-gtm-module'

import { google_tag_manager_container_id } from '@/utils/env'

import { TrackCustomEventParams } from './types'

class Tracker {
  init() {
    TagManager.initialize({ gtmId: google_tag_manager_container_id || '' })
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

export default new Tracker()
