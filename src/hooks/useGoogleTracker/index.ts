import { useCallback } from 'react'
import ReactGA from 'react-ga'

import { useGoogleTrackerProps } from './types'

export default function useGoogleTracker(props: useGoogleTrackerProps) {
  const trackEvent = useCallback(() => {
    ReactGA.event(props)
  }, [props])

  return trackEvent
}
