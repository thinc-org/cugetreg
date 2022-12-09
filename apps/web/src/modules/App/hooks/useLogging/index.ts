import { useEffect } from 'react'

import { Tracker } from '@web/common/tracker'
import { startLogging } from '@web/services/logging'

export function useLogging() {
  // TODO: move outside hook
  useEffect(() => {
    Tracker?.init()
    startLogging()
  }, [])
}
