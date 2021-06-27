import { useRouter } from 'next/router'
// import { collectLogEvent } from '@/utils/network/logging'

interface AnalyticsProps {
  children: React.FC<{ log: () => void }>
  elementName: string
  elementId?: string
  pathId?: string
}

export function Analytics({ children, elementName, elementId, pathId }: AnalyticsProps) {
  const { pathname } = useRouter()
  const log = () => {
    console.log(pathname, pathId, elementName, elementId, navigator.userAgent)
    // To DO put data into collectLogEvent
    // collectLogEvent({
    //   kind: 'track',
    //   message: event.value,
    // })
  }

  return children({ log })
}
