import { useEffect } from 'react'

import { useRouter } from 'next/router'

interface ProctectedRoutesProps {
  children: JSX.Element
}

// export const unProtectedRoutes = ['/login', '/pendingReviews']
export const unProtectedRoutes = ['/login', '/generateToken']

export const ProtectedRoutes = (props: ProctectedRoutesProps) => {
  const { children } = props
  //   TODO: useUser instead
  //   const { isLoggedIn, isLoading } = useUser()
  const isLoggedIn = true
  const isLoading = false
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!unProtectedRoutes.includes(router.pathname) && !isLoggedIn) {
      router.push('/login')
      return
    }
  }, [isLoading, isLoggedIn, router])

  return children
}
