import { useEffect, useState, useRef } from 'react'
import { UserEvent, AnalyticsType } from './types'

export function useAnalytics() {
  const [events, setEvents] = useState<UserEvent[]>([])
  const timeoutRef = useRef<number>()

  const addEvent: AnalyticsType['addEvent'] = (e) => {
    setEvents(events.concat(e))
  }

  useEffect(() => {
    const callApi = () => {
      console.log(events, 'events', navigator.userAgent)
      setEvents([])
      clearTimeout(timeoutRef.current)
    }
    if (events.length !== 0) {
      clearTimeout(timeoutRef.current)
      if (events.length >= 10) {
        callApi()
      } else {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => {
          callApi()
        }, 2000)
      }
      return () => clearTimeout(timeoutRef.current)
    }
  }, [events])

  return { addEvent }
}
