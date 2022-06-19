import { useEffect } from 'react'

import { Tracker } from '@/common/tracker'
import { startLogging } from '@/services/logging'

export function useLogging() {
  // TODO: move outside hook
  useEffect(() => {
    Tracker?.init()
    startLogging()
  }, [])
}
