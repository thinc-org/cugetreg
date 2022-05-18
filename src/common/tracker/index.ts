import { TrackCustomEventParams } from './types'

class MasterTracker {
  trackPageView(url: string) {
    if (!window?.dataLayer) return
    window.dataLayer.push({
      dataLayer: {
        event: 'pageView',
        url: url,
      },
    })
  }

  trackCustomEvent<T = {}>({ event, category, action, label, custom, screenName }: TrackCustomEventParams<T>) {
    if (!window?.dataLayer) return
    window.dataLayer.push({
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
