import { useCallback } from 'react'

import { useScreenName } from '@/common/hooks/useScreenName'
import Tracker from '@/common/tracker'

import { UseTrackEventProps } from './types'

export function useTrackEvent(trackParams: UseTrackEventProps) {
  const currentScreenName = useScreenName()

  const trackEvent = useCallback(() => {
    Tracker.trackCustomEvent({
      ...trackParams,
      screenName: currentScreenName,
      custom: {
        userId: '',
      },
    })
  }, [trackParams, currentScreenName])

  if (!currentScreenName) return () => null

  return trackEvent
}
