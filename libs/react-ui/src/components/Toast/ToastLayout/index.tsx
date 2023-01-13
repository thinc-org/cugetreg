import { PropsWithChildren } from 'react'

import { ContentContainer, Layout } from './styled'

export type ToastLayoutProps = PropsWithChildren<{
  actions?: JSX.Element
}>

/**
 * Toast layout component for wrapping the toast content
 *
 * @param {JSX.Element} actions Actions to be rendered. Should be wrapped in ToastAction
 * @param {JSX.Element} children The toast content
 * @returns {JSX.Element} Rendered component
 */
export function ToastLayout({ actions, children }: ToastLayoutProps) {
  return (
    <Layout>
      <ContentContainer>{children}</ContentContainer>
      {actions}
    </Layout>
  )
}
