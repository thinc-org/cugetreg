import { CredentialResponse, IdConfiguration } from 'google-one-tap'
import { useEffect, useState } from 'react'

import { GOOGLE_OAUTH_ID } from '@web/env'
import { userStore } from '@web/store/userStore'

export function useGoogleOneTap(promptRef: React.RefObject<HTMLDivElement>) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!promptRef.current || !GOOGLE_OAUTH_ID) return

    window.google?.accounts.id.initialize({
      client_id: GOOGLE_OAUTH_ID,
      callback: (response: CredentialResponse) => {
        userStore.loginWithIdToken(response.credential)
      },
      itp_supported: false,
      cancel_on_tap_outside: false,
      prompt_parent_id: promptRef.current.id,
      hosted_domain: 'student.chula.ac.th', // hosted_domain is undocumented in the official documentation
    } as IdConfiguration)
    setIsInitialized(true)
  }, [promptRef.current])

  useEffect(() => {
    if (isInitialized && userStore.isInitialized && !userStore.isLoggedIn()) {
      window.google?.accounts.id.prompt()
    }
  }, [isInitialized, userStore.accessToken, userStore.isInitialized])
}
