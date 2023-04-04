import { useEffect, useState } from 'react'

export default function useUser() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function authorize() {
      try {
        // TODO: change to apollo client
        const res = await fetch('https://google.com')
        setIsLoggedIn(true)
      } catch (err) {
        console.log(err)
        setIsLoggedIn(false)
      }
    }
    authorize()
    setIsLoading(false)
  }, [])

  return { isLoggedIn, isLoading }
}
