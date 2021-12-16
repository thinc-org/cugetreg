import { PropsWithChildren } from 'react'

import { Layout, ContentContainer } from './styled'

export type ToastLayoutProps = PropsWithChildren<{
  actions?: JSX.Element
}>

export function ToastLayout({ actions, children }: ToastLayoutProps) {
  return (
    <Layout>
      <ContentContainer>{children}</ContentContainer>
      {actions}
    </Layout>
  )
}
