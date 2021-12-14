import { action, makeAutoObservable, when } from 'mobx'

import { apiUrl, httpClient } from '@/services/httpClient'
import { courseCartStore } from '@/store'
import env from '@/utils/env/macro'

class UserStore {
  private isInitialized: boolean = false
  accessToken: string | null

  constructor() {
    this.accessToken = null
    makeAutoObservable(this)
    this.restoreSession()
  }

  login = () => {
    const isLocal = env.environment === 'local'
    const urlParams = new URLSearchParams({
      returnUrl: window.location.href,
    })
    if (isLocal) {
      urlParams.set('backendUrl', apiUrl ?? '')
    }
    window.location.href = `${apiUrl}/auth/google?${urlParams.toString()}`
  }

  logout = () => {
    this.setAccessToken(null)
    httpClient.post(`/auth/logout`)
    courseCartStore.upgradeSource()
  }

  private restoreSession = async () => {
    try {
      if (typeof window === 'undefined') return
      const res = await httpClient.post(`/auth/refreshtoken`)
      this.setAccessToken(res.data.accessToken)
      console.info('Auth session restored')
    } catch (e) {
      console.error('Fail to restore auth session', e)
    } finally {
      this.isInitialized = true
    }
  }

  isLoggedIn = () => {
    return userStore.accessToken !== null
  }

  @action
  private setAccessToken = (accessToken: string | null) => {
    this.accessToken = accessToken
  }

  waitUntilInitialized = async () => {
    await when(() => this.isInitialized)
  }

  getAccessToken = async () => {
    await this.waitUntilInitialized()
    return this.accessToken
  }
}

export const userStore = new UserStore()
