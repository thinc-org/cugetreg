import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { useRouter } from 'next/router'

import { UserDto } from '@admin-web/common/types/UserDto'
import { authApi } from '@admin-web/utils/authAxios'

import { useAuth } from './AuthProvider'

interface ProctectedRoutesProps {
  children: React.ReactNode
}

export const unProtectedRoutes = ['/login', '/generateToken']

export const ProtectedRoutes = (props: ProctectedRoutesProps) => {
  const { children } = props
  const router = useRouter()

  const { user, setUser } = useAuth()

  useEffect(() => {
    if (!router) return
    if (unProtectedRoutes.includes(router.pathname)) return
    if (user) return

    const loadUserData = async () => {
      try {
        const res = await authApi.get('/me')
        const user = res.data as UserDto
        setUser(user)
      } catch (err) {
        // TODO: add error handler
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Error logging user in. Retry logging in')
        router.push('/login')
      }
    }
    loadUserData()
  }, [router])

  return <>{children}</>
}
