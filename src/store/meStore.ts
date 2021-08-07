import { action, computed, makeObservable, observable, runInAction } from 'mobx'

import { retrieveAuthDataUsingCode, retrieveMeData } from '@/utils/network/auth'
import { collectErrorLog, collectLogEvent } from '@/utils/network/logging'

/**
 * Authorization token for authenticating with the backend
 */
export interface AuthData {
  /** Token for authorizing with the backend */
  accessToken: string
  _id: string
  firstName: string
}

/**
 * User's data and API tokens. Refreshed periodically
 */
export interface MeData {
  _id: string
  email: string
  firstName?: string
  lastName?: string

  /**Google API token */
  google: {
    accessToken: string
    expiresIn: Date
  }
}

const AUTHDATA_LOCALSTORAGE_FIELD = 'authdata'

export class AuthStore {
  auth: AuthData | null = null
  me: MeData | null = null
  pending: boolean = true
  private refreshTimer: number | null = null

  constructor() {
    makeObservable(this, {
      auth: observable,
      me: observable,
      pending: observable,
      isLoggedIn: computed,
      clear: action,
    })
  }

  get isLoggedIn(): boolean {
    return this.auth !== null
  }

  /** Use Google OAuth2.0 Code to authenticate with the backend */
  async authenticateWithCode(code: string) {
    collectLogEvent({
      kind: 'track',
      message: 'user attempting to authenticate',
    })

    const authData = await retrieveAuthDataUsingCode(code)
    const meData = await retrieveMeData(authData)
    runInAction(() => {
      this.auth = authData
      this.me = meData
      this.pending = false
    })
    this.startRefreshTokenTimer()
    localStorage.setItem(AUTHDATA_LOCALSTORAGE_FIELD, JSON.stringify(authData))

    collectLogEvent({
      kind: 'track',
      message: 'user authenticated',
    })
  }

  /** Try restoring AuthStore using localstorage. */
  async tryRestoreWithLocalStorage() {
    if (typeof localStorage == 'undefined') return
    const authDataJsonString = localStorage.getItem(AUTHDATA_LOCALSTORAGE_FIELD)
    if (!authDataJsonString) {
      runInAction(() => {
        this.pending = false
      })
      return
    }
    const authData = JSON.parse(authDataJsonString) as AuthData

    try {
      const meData = await retrieveMeData(authData)
      runInAction(() => {
        this.auth = authData
        this.me = meData
      })
      this.startRefreshTokenTimer()
    } catch (e) {
      // Ignore
      console.log('[AuthStore] Failed to restore MeData', e)
      collectErrorLog("can't retrieve me data from local storage auth, ignoring", e)
      return
    } finally {
      runInAction(() => {
        this.pending = false
      })
    }
  }

  private startRefreshTokenTimer() {
    if (this.refreshTimer) clearInterval(this.refreshTimer)

    this.refreshTimer = window.setInterval(async () => {
      if (!this.auth) throw new Error('[BUG] Refresh Timer is running despite not logged-in')
      const data = await retrieveMeData(this.auth)
      runInAction(() => {
        this.me = data
      })
    }, 1000 * 60 * 5)
  }

  /** Logout */
  clear() {
    this.auth = null
    this.me = null
    this.pending = false
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }

    if (localStorage) {
      localStorage.removeItem(AUTHDATA_LOCALSTORAGE_FIELD)
    }

    // TO DO: remove and use analytics instead
    collectLogEvent({
      kind: 'track',
      message: 'user logged out',
    })
  }
}

export const authStore = new AuthStore()
