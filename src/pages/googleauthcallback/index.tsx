import { authenticateByCode, refreshAuthToken } from '@/utils/network/auth'
import { useApolloClient } from '@apollo/client'
import { Card, CardContent, LinearProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function GoogleAuthCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Authenticating')
  const [loading, setLoading] = useState(false)
  const code = router.query.code
  const error = router.query.error

  const nextUrl = decodeURI(router.query.state as string)
  const client = useApolloClient()

  useEffect(() => {
    if (error) {
      setMsg(
        `Error while authenticating with Google. (cause ${error}). In case that you declined this app's permission to access Google Drive, Please rest assured that all functionality of this app would still works except saving selected course. You don't need to log in to use this app`
      )
      setLoading(false)
      return
    }
    if (typeof code !== 'string' || typeof nextUrl !== 'string') {
      setMsg(`Page is loading. If you you wait for too long please try logging in again`)
      setLoading(false)
      return
    }
    setLoading(true)
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
      .finally(() => setLoading(false))
  }, [code, client, router, nextUrl])

  return (
    <Card>
      {loading && <LinearProgress />}
      <CardContent>{msg}</CardContent>
    </Card>
  )
}
