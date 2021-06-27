import { AnalyticsContext } from '@/context/analytics'
import { useRouter } from 'next/router'
import { useContext } from 'react'
// import { collectLogEvent } from '@/utils/network/logging'

interface AnalyticsProps {
  children: React.FC<{ log: (_?: unknown, value?: string) => void }>
  elementName: string
  elementId?: string
  pathId?: string
}

export function Analytics({ children, elementName, elementId, pathId }: AnalyticsProps) {
  const { pathname } = useRouter()
  const { addEvent } = useContext(AnalyticsContext)
  const log = (_?: unknown, value?: string) => {
    const event = { value, pathname, pathId, elementName, elementId, eventType: 'click' }
    addEvent(event)
  }

  return children({ log })
}
