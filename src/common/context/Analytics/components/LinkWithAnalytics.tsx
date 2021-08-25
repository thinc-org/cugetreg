import Link, { LinkProps } from 'next/link'
import { cloneElement, ReactElement } from 'react'

import { useLog } from './useLog'

interface LinkComponentProps {
  onMouseEnter?: ((event: React.MouseEvent<Element, MouseEvent>) => void) | undefined
  onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void
  href?: string | undefined
  ref?: unknown
}

interface LinkWithAnalyticsProps extends LinkProps {
  elementName?: string
  elementId?: string
  pathId?: string
}

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
  return <Link {...props}>{cloneElement(children, { onClick })}</Link>
}
