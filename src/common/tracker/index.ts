import TagManager from 'react-gtm-module'
import { google_tag_manager_container_id } from '@/utils/env'

import { TrackParams } from './types'

class Tracker {
  gtmContainerId: string = ''

  init() {
    this.gtmContainerId = google_tag_manager_container_id || ''

    TagManager.initialize({ gtmId: 'GTM-XXXXX' })
  }

  trackPageView(url: string) {
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageView',
        url: url,
      },
    })
  }

  trackEvent({}: TrackParams) {
    TagManager.dataLayer({
      dataLayer: {
        event: 'event',
        category: '',
        action: '',
        label: '',
      },
    })
  }
}

export default new Tracker()
