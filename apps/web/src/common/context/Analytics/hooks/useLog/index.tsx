import { useContext } from 'react'

import { AnalyticsContext } from '@web/common/context/Analytics'
import { useRouter } from 'next/router'

/**
 * TODO: Should move to common/tracker/hooks
 */
/**
 * useLog hooks for logging, only use if cannot use Analytics component only
 * @param elementName
 * @param pathId
 * @param elementId
 * @returns
 */
export function useLog(elementName?: string, elementId?: string, pathId?: string) {
  const { pathname } = useRouter()
  const { addEvent } = useContext(AnalyticsContext)
  const log = (_?: unknown, value?: string) => {
    const event = {
      value,
      pathname,
      pathId,
      elementName,
      elementId,
      timeStamp: new Date(),
      eventType: 'click',
    }
    addEvent(event)
  }

  return { log }
}
