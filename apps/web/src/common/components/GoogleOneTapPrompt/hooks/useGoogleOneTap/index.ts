import { useEffect, useState } from 'react'

import { CredentialResponse, IdConfiguration } from 'google-one-tap'

import { GOOGLE_OAUTH_ID } from '@web/env'
import { userStore } from '@web/store/userStore'

interface ExtendedIdConfiguration extends IdConfiguration {
  hosted_domain: string // hosted_domain is undocumented in the official documentation
}

export function useGoogleOneTap(promptRef: React.RefObject<HTMLDivElement>) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!promptRef.current || !GOOGLE_OAUTH_ID) return

    const config: ExtendedIdConfiguration = {
      client_id: GOOGLE_OAUTH_ID,
      callback: (response: CredentialResponse) => {
        userStore.loginWithIdToken(response.credential)
      },
      auto_select: true,
      itp_support: false,
      cancel_on_tap_outside: false,
      prompt_parent_id: promptRef.current.id,
      hosted_domain: 'student.chula.ac.th',
    }
    window.google?.accounts.id.initialize(config as IdConfiguration)
    setIsInitialized(true)
  }, [promptRef.current])

  useEffect(() => {
    if (isInitialized && userStore.isInitialized && !userStore.isLoggedIn()) {
      window.google?.accounts.id.prompt()
    }
  }, [isInitialized, userStore.accessToken, userStore.isInitialized])
}
