import { authenticateByCode } from '@/utils/network/auth'
import { useApolloClient } from '@apollo/client'
import { Card, CardContent, LinearProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function GoogleAuthCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Authenticating')
  const code = router.query.code
  const client = useApolloClient()

  useEffect(() => {
    if (typeof code !== 'string') {
      return
    }

    authenticateByCode(client, code)
      .then(() => {
        setMsg('Redirecting...')
        router.push('/')
      })
      .catch((e) => {
        setMsg(`Error during authentication: ${e.message}`)
      })
  }, [code, client, router])

  return (
    <Card>
      {msg == 'Authenticating' && <LinearProgress />}
      <CardContent>{msg}</CardContent>
    </Card>
  )
}
