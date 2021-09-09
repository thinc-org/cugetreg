import React from 'react'

import { useLog } from '../../hooks/useLog'
import { AnalyticsProps } from './types'

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
