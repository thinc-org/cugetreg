import { ReactElement, cloneElement } from 'react'

import Link from 'next/link'

import { useLog } from '../../hooks/useLog'
import { LinkComponentProps, LinkWithAnalyticsProps } from './types'

export function LinkWithAnalytics({
  children,
  elementName,
  elementId,
  pathId,
  ...props
}: LinkWithAnalyticsProps & { children: ReactElement<LinkComponentProps> }) {
  const { log } = useLog(elementName, elementId, pathId)
  const childrenOnClick = children.props.onClick
  const onClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    childrenOnClick?.(event)
    log()
  }
  return (
    <Link {...props} legacyBehavior>
      {cloneElement(children, { onClick })}
    </Link>
  )
}
