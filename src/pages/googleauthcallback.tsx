import { authStore } from '@/store/meStore'
import { Card, CardContent, LinearProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function GoogleAuthCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Authenticating')
  const [loading, setLoading] = useState(false)
  const code = router.query.code
  const error = router.query.error

  if (typeof window !== 'undefined' && location.hash.startsWith('#code')) {
    router.replace(`/googleauthcallback?${location.hash.substring(1)}`)
  }

  const nextUrl = decodeURI(router.query.state as string)

  useEffect(() => {
    if (error) {
      setMsg(
        `Error while authenticating with Google. (cause ${error}). In case that you declined this app's permission to access Google Drive, Please rest assured that all functionality of this app would still works except saving selected course. You don't need to log in to use this app`
      )
      setLoading(false)
      return
    }
    if (typeof code !== 'string' || typeof nextUrl !== 'string') {
      setMsg(`Waiting for data. If you you waited for too long then please try logging in again`)
      setLoading(false)
      return
    }

    setLoading(true)
    setMsg('Authenticating...')
    authStore
      .authenticateWithCode(code)
      .then(() => {
        setMsg('Redirecting...')
        router.push(nextUrl)
      })
      .catch((e) => {
        setMsg(`Error during authentication: ${e.message}`)
      })
      .finally(() => setLoading(false))
  }, [code, router, nextUrl])

  return (
    <Card>
      {loading && <LinearProgress />}
      <CardContent>{msg}</CardContent>
    </Card>
  )
}
