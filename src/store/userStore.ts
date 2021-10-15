import axios from 'axios'
import { action, makeAutoObservable } from 'mobx'
import { NextRouter } from 'next/router'

import { courseCartStore } from '@/store'
import env from '@/utils/env/macro'

class UserStore {
  accessToken: string | null

  constructor() {
    this.accessToken = null
    makeAutoObservable(this)
  }

  login = (router: NextRouter) => {
    router.push(`${env.backend.uri}/auth/google`)
  }

  logout = () => {
    this.accessToken = null
    axios.post(`${env.backend.uri}/auth/logout`)
    courseCartStore.upgradeSource()
  }

  restoreSession = () =>
    axios
      .post(`${env.backend.uri}/auth/refreshtoken`)
      .then(
        action('setAccessToken', (res) => {
          userStore.accessToken = res.data.accessToken
          console.info('Auth session restored')
        })
      )
      .catch((e) => console.error('Fail to restore auth session', e))
}

export const userStore = new UserStore()
