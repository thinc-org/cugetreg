import { ENVIRONMENT } from '@web/env'
import { apiUrl, httpClient } from '@web/services/httpClient'
import { courseCartStore } from '@web/store'
import { action, makeAutoObservable, when } from 'mobx'

class UserStore {
  isInitialized = false
  accessToken: string | null

  constructor() {
    this.accessToken = null
    makeAutoObservable(this)
    this.restoreSession()
  }

  login = () => {
    const urlParams = new URLSearchParams({
      returnUrl: window.location.href,
    })
    if (ENVIRONMENT === 'local') {
      urlParams.set('backendUrl', apiUrl ?? '')
    }
    window.location.href = `${apiUrl}/auth/google?${urlParams.toString()}`
  }

  loginWithIdToken = async (idToken: string) => {
    try {
      await httpClient.post(`/auth/google/idtoken`, {
        idToken,
      })
      await this.restoreSession()
      await courseCartStore.upgradeSource()
    } catch (e) {
      console.error('Fail to login with id token', e)
    }
  }

  logout = () => {
    window.google?.accounts?.id?.disableAutoSelect()
    this.setAccessToken(null)
    httpClient.post(`/auth/logout`)
    courseCartStore.upgradeSource()
  }

  private restoreSession = async () => {
    try {
      if (typeof window === 'undefined') return
      const res = await httpClient.post<{ accessToken: string }>(`/auth/refreshtoken`)
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
