import Link, { LinkProps } from 'next/link'
import { cloneElement, forwardRef, ReactElement } from 'react'

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
  return (
    <Link {...props}>
      <CaptureProps>
        {({ onClick, ...props }, ref) => {
          const handleClick = (event: React.MouseEvent<Element, MouseEvent>) => {
            log()
            if (typeof onClick === 'function') {
              onClick(event)
            }
          }
          return cloneElement(children, { ref, onClick: handleClick, ...props })
        }}
      </CaptureProps>
    </Link>
  )
}

interface CapturePropsProps extends LinkComponentProps {
  children: (props: LinkComponentProps, ref: unknown) => ReactElement<LinkComponentProps>
}

const CaptureProps = forwardRef(function CaptureProps({ children, ...props }: CapturePropsProps, ref: unknown) {
  return children(props, ref)
})
