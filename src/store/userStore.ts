import { action, makeAutoObservable } from 'mobx'
import { NextRouter } from 'next/router'

import { apiUrl, httpClient } from '@/services/httpClient'
import { courseCartStore } from '@/store'
import env from '@/utils/env/macro'

class UserStore {
  accessToken: string | null

  constructor() {
    this.accessToken = null
    makeAutoObservable(this)
  }

  login = (router: NextRouter) => {
    const isLocal = env.environment === 'local'
    const urlParams = new URLSearchParams({
      returnUrl: (isLocal ? window.location.origin : '') + router.asPath,
    })
    if (isLocal) {
      urlParams.set('backendUrl', apiUrl ?? '')
    }
    window.location.href = `${apiUrl}/auth/google?${urlParams.toString()}`
  }

  logout = () => {
    this.accessToken = null
    httpClient.post(`/auth/logout`)
    courseCartStore.upgradeSource()
  }

  restoreSession = () =>
    httpClient
      .post(`/auth/refreshtoken`)
      .then(
        action('setAccessToken', (res) => {
          userStore.accessToken = res.data.accessToken
          console.info('Auth session restored')
        })
      )
      .catch((e) => console.error('Fail to restore auth session', e))
}

export const userStore = new UserStore()
