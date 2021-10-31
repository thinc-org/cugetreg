import { collectLogEvent } from '@/services/logging'
import { google_analytic_property } from '@/utils/env'

import { AnalyticsType } from '../../types'

export function useAnalytics() {
  const addEvent: AnalyticsType['addEvent'] = (e) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gaData = typeof window !== 'undefined' && (window as any).gaData
    const experiments = gaData && gaData[google_analytic_property]?.experiments

    return collectLogEvent({
      kind: 'fine-tracking',
      message: `User performed ${e.eventType} on object ${e.pathname} at ${e.timeStamp}`,
      additionalData: {
        value: e.value || '',
        elementName: e.elementName || '',
        elementId: e.elementId || '',
        eventType: e.eventType,
        pathname: e.pathname,
        pathId: e.pathId || '',
        ua: navigator?.userAgent || '',
        experiments: JSON.stringify(experiments),
      },
    })
  }

  return { addEvent }
}
