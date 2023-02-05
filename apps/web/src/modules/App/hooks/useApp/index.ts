import { useEffect } from 'react'

import { Router } from 'next/router'

import { ENABLE_DARK_THEME, GOOGLE_OAUTH_ID } from '@web/env'
import { collectLogEvent } from '@web/services/logging'
import { courseCartStore } from '@web/store'
import { userStore } from '@web/store/userStore'

import { StudyProgram } from '@cgr/codegen'

import { removeElement } from '../../utils/removeElement'
import { useLogging } from '../useLogging'
import { CredentialResponse, IdConfiguration } from 'google-one-tap'

export function useApp(router: Router) {
  useLogging()

  useEffect(() => {
    collectLogEvent({
      kind: 'track',
      message: 'Session started',
    })
    courseCartStore.upgradeSource()
    userStore.waitUntilInitialized().then(() => courseCartStore.upgradeSource())
  }, [])

  useEffect(() => {
    removeElement('jss-server-side')
    if (ENABLE_DARK_THEME) {
      removeElement('cgr-dark')
    }
  })

  useEffect(() => {
    const studyProgram = router.query.studyProgram as string
    if (studyProgram && !(Object.values(StudyProgram) as string[]).includes(studyProgram)) {
      router.replace('/')
    }
    // eslint-disable-next-line
  }, [router.query])

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: GOOGLE_OAUTH_ID,
      callback: (response: CredentialResponse) => {
        userStore.loginWithIdToken(response.credential)
      },
      cancel_on_tap_outside: false,
      hosted_domain: 'student.chula.ac.th', // hosted_domain is undocumented in the official documentation
    } as IdConfiguration)

    if (!userStore.isLoggedIn() && !!GOOGLE_OAUTH_ID) {
      window.google?.accounts.id.prompt()
    }
  }, [userStore.accessToken])
}
