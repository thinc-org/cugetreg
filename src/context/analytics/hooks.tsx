import { collectLogEvent } from '@/utils/network/logging'
import { useEffect, useState, useRef } from 'react'
import { UserEvent, AnalyticsType } from './types'

export function useAnalytics() {
  const [events, setEvents] = useState<UserEvent[]>([])
  const timeoutRef = useRef<number>()

  const addEvent: AnalyticsType['addEvent'] = (e) =>
    collectLogEvent({
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
      },
    })

  return { addEvent }
}
