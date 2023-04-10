import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { useRouter } from 'next/router'

export function GenerateToken() {
  const router = useRouter()

  useEffect(() => {
    if (!router) return

    const { code } = router.query

    const getToken = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_TOKEN_URL) {
          throw new Error('TOKEN_URL is not defined')
        }

        console.log(code, typeof code)

        if (!code || typeof code !== 'string') {
          throw new Error('Code is not defined or is invalid')
        }

        const url = new URL(process.env.NEXT_PUBLIC_TOKEN_URL)
        url.searchParams.append('code', code)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
      } catch (err) {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Unknown error')
      }
    }
    getToken()
  }, [router])

  return (
    <>
      <h1>Hello</h1>
    </>
  )
}
