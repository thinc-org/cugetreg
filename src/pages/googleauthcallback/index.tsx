import { authenticateByCode, refreshAuthToken } from '@/utils/network/auth'
import { useApolloClient } from '@apollo/client'
import { Card, CardContent, LinearProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function GoogleAuthCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Authenticating')
  const code = router.query.code

  const nextUrl = decodeURI(router.query.state as string)
  const client = useApolloClient()

  useEffect(() => {
    if (typeof code !== 'string' || typeof nextUrl !== 'string') {
      return
    }
    authenticateByCode(client, code)
      .then(() => {
        setMsg('Authenticating...')
        refreshAuthToken().then(() => {
          setMsg('Redirecting...')
          router.push(nextUrl)
        })
      })
      .catch((e) => {
        setMsg(`Error during authentication: ${e.message}`)
      })
  }, [code, client, router, nextUrl])

  return (
    <Card>
      {msg == 'Authenticating' && <LinearProgress />}
      <CardContent>{msg}</CardContent>
    </Card>
  )
}
