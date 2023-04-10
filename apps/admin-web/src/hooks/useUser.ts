import { useEffect, useState } from 'react'

import { UserDto } from '@admin-web/common/types/UserDto'

export function useUser() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserDto | null>(null)

  useEffect(() => {
    async function authorize() {
      try {
        // TODO: change to apollo client
        const res = await fetch('http://localhost:3333/_api/auth/me', { credentials: 'include' })
        const data = await res.json()
        console.log(`Response: ${data.data}`)
        setIsLoggedIn(true)
        setUser(data)
      } catch (err) {
        // TODO: Add toast
        console.log(err)
        setIsLoggedIn(false)
      }
    }
    authorize()
    setIsLoading(false)
  }, [])

  return { isLoggedIn, isLoading, user }
}
