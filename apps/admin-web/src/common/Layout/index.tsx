import { Toaster } from 'react-hot-toast'

import { useRouter } from 'next/router'

import SideBar from '@admin-web/common/Sidebar'
import { toastConfig } from '@admin-web/config/toastConfig'

import { LayoutContainer } from './styled'

interface AppProviderProps {
  children: React.ReactNode
}

export function Layout({ children }: AppProviderProps) {
  const router = useRouter()
  const disableSideBar = router.pathname.startsWith('/login')
  return (
    <LayoutContainer>
      {!disableSideBar && <SideBar />}
      {children}
      <Toaster position="top-center" reverseOrder={false} toastOptions={toastConfig} />
    </LayoutContainer>
  )
}
