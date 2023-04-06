import { useEffect } from 'react'

import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  useEffect(() => {
    const auth_url = new URL('https://auth.internal.cugetreg.com/application/o/authorize/')
    const response_type = 'code'
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID || ''
    const scope = 'openid+profile+email'
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI || ''
    auth_url.searchParams.append('response_type', response_type)
    auth_url.searchParams.append('client_id', client_id)
    auth_url.searchParams.append('scope', scope)
    auth_url.searchParams.append('redirect_uri', redirect_uri)
    router.push(auth_url)
  }, [])
}
