import Topbar from '@admin-web/common/Topbar'

import { LayoutContainer } from './style'

interface AppProviderProps {
  children: React.ReactNode
}

export function Layout({ children }: AppProviderProps) {
  return (
    <LayoutContainer>
      <Topbar />
      {children}
    </LayoutContainer>
  )
}
