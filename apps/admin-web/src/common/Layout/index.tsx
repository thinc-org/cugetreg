import SideBar from '@admin-web/common/Sidebar'

import { LayoutContainer } from './styled'

interface AppProviderProps {
  children: React.ReactNode
}

export function Layout({ children }: AppProviderProps) {
  return (
    <LayoutContainer>
      <SideBar />
      {children}
    </LayoutContainer>
  )
}
