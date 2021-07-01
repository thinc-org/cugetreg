import React, { ReactElement } from 'react'
import { useLog } from './useLog'

interface ClickableElementProps {
  onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void
}

interface AnalyticsProps extends ClickableElementProps {
  children: ReactElement<ClickableElementProps> | React.FC<{ log: (_?: unknown, value?: string) => void }>
  elementName?: string
  elementId?: string
  pathId?: string
}

export function Analytics({ onClick, children, elementName, elementId, pathId }: AnalyticsProps) {
  const { log } = useLog(elementName, elementId, pathId)

  if (typeof children === 'function') {
    return children({ log })
  } else {
    const handleClick = (event: React.MouseEvent<Element, MouseEvent>) => {
      log()
      if (typeof onClick === 'function') {
        onClick(event)
      } else if (typeof children.props.onClick === 'function') {
        children.props.onClick(event)
      }
    }
    return React.cloneElement(children, { onClick: handleClick })
  }
}
