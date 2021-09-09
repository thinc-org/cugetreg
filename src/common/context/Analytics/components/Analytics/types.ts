import { ReactElement } from 'react'

export interface ClickableElementProps {
  onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void
}

export interface AnalyticsProps extends ClickableElementProps {
  children: ReactElement<ClickableElementProps> | React.FC<{ log: (_?: unknown, value?: string) => void }>
  elementName?: string
  elementId?: string
  pathId?: string
}
