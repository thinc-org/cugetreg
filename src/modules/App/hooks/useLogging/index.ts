import { useEffect } from 'react'

import { startLogging } from '@/services/logging'

export function useLogging() {
  // TODO: move outside hook
  useEffect(() => {
    startLogging()
  }, [])
}
