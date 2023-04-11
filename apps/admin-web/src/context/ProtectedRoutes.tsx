import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

import axios from 'axios'
import { useRouter } from 'next/router'

import { UserDto } from '@admin-web/common/types/UserDto'

interface ProctectedRoutesProps {
  children: React.ReactNode
}

export const unProtectedRoutes = ['/login', '/generateToken']

export const ProtectedRoutes = (props: ProctectedRoutesProps) => {
  const { children } = props
  const router = useRouter()

  useEffect(() => {
    if (!router) return
    if (unProtectedRoutes.includes(router.pathname)) return

    const loadUserData = async () => {
      try {
        const res = await axios.get('http://localhost:3333/_api/auth/me', { withCredentials: true })
        console.log(res)
        const user = res.data as UserDto
        console.log(user)
        // TODO: set auth provider
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push('/login')
        } else {
          // TODO: add error handler
          toast.error('Error logging user in')
        }
      }
    }
    loadUserData()
  }, [router])

  return <>{children}</>
}
