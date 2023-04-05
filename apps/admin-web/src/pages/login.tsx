import { useEffect } from 'react'

import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  useEffect(() => {
    const auth_url = 'https://auth.internal.cugetreg.com/application/o/authorize/?'
    const response_type = 'code'
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID || ''
    const scope = 'openid+profile+email'
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI || ''
    const params = new URLSearchParams({ response_type, client_id, scope, redirect_uri })
    const url = auth_url + params
    console.log(url)
    router.push(url)
  }, [])
}
