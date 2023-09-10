import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()

  // TODO: decorate this page
  const handleLogin = () => {
    const auth_url = new URL(process.env.NEXT_PUBLIC_AUTHORIZE_URL || '')
    const response_type = 'code'
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID || ''
    const scope = 'openid profile email'
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI || ''
    auth_url.searchParams.append('response_type', response_type)
    auth_url.searchParams.append('client_id', client_id)
    auth_url.searchParams.append('scope', scope)
    auth_url.searchParams.append('redirect_uri', redirect_uri)
    router.push(auth_url)
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login with authentik</button>
    </div>
  )
}
