import { useLog } from '@/context/analytics/components/useLog'
import { collectLogEvent } from '@/utils/network/logging'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface TrackPageChangeProps {
  children: React.ReactNode
}

export function TrackPageChange({ children }: TrackPageChangeProps) {
  const { log } = useLog('visit')
  const router = useRouter()

  useEffect(() => {
    // TO DO: remove collectLogEvent and use log() instead
    collectLogEvent({
      kind: 'track',
      message: `user change path`,
      detail: `${location.origin}-${router.pathname}`,
    })
    log()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname])

  return <>{children}</>
}
