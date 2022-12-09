import { LinkProps } from 'next/link'

export interface LinkComponentProps {
  onMouseEnter?: ((event: React.MouseEvent<Element, MouseEvent>) => void) | undefined
  onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void
  href?: string | undefined
  ref?: unknown
}

export interface LinkWithAnalyticsProps extends LinkProps {
  elementName?: string
  elementId?: string
  pathId?: string
}
