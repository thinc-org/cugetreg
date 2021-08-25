import { useEffect } from 'react'

import Tracker from '@/common/tracker'
import { startLogging } from '@/services/logging'

export default function useLogging() {
  useEffect(() => {
    Tracker.init()
    startLogging()
  }, [])
}
