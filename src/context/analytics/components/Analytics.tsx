import { useLog } from './useLog'

interface AnalyticsProps {
  children: React.FC<{ log: (_?: unknown, value?: string) => void }>
  elementName?: string
  elementId?: string
  pathId?: string
}

export function Analytics({ children, elementName, elementId, pathId }: AnalyticsProps) {
  const { log } = useLog(elementName, elementId, pathId)

  return children({ log })
}
