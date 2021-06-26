import { retrieveAuthDataUsingCode, retrieveMeData } from '@/utils/network/auth'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'

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
  private refreshTimer: number | null = null

  constructor() {
    makeObservable(this, {
      auth: observable,
      me: observable,
      isLoggedIn: computed,
      clear: action,
    })
  }

  get isLoggedIn(): boolean {
    return this.auth !== null
  }

  /** Use Google OAuth2.0 Code to authenticate with the backend */
  async authenticateWithCode(code: string) {
    const authData = await retrieveAuthDataUsingCode(code)
    const meData = await retrieveMeData(authData)
    runInAction(() => {
      this.auth = authData
      this.me = meData
    })
    this.startRefreshTokenTimer()
    localStorage.setItem(AUTHDATA_LOCALSTORAGE_FIELD, JSON.stringify(authData))
  }

  /** Try restoring AuthStore using localstorage. */
  async tryRestoreWithLocalStorage() {
    if (typeof localStorage == 'undefined') return
    const authDataJsonString = localStorage.getItem(AUTHDATA_LOCALSTORAGE_FIELD)
    if (!authDataJsonString) return
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
      return
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
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }

    if (localStorage) {
      localStorage.removeItem(AUTHDATA_LOCALSTORAGE_FIELD)
    }
  }
}

export const authStore = new AuthStore()
