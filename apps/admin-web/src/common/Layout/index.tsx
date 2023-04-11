import { Toaster } from 'react-hot-toast'

import SideBar from '@admin-web/common/Sidebar'
import { toastConfig } from '@admin-web/config/toastConfig'

import { LayoutContainer } from './styled'

interface AppProviderProps {
  children: React.ReactNode
}

export function Layout({ children }: AppProviderProps) {
  return (
    <LayoutContainer>
      <SideBar />
      {children}
      <Toaster position="top-center" reverseOrder={false} toastOptions={toastConfig} />
    </LayoutContainer>
  )
}
