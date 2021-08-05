import { useCallback } from 'react'

import Tracker from '@/common/tracker'
import useScreenName from '@/common/hooks/useScreenName'

function useTrackEvent() {
  const currentScreenName = useScreenName()

  const trackEvent = useCallback(() => {
    Tracker.trackEvent({
      screen: currentScreenName || '',
    })
  }, [currentScreenName])

  if (!currentScreenName) return () => null

  return trackEvent
}

export default useTrackEvent
