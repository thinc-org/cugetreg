import { makeAutoObservable } from 'mobx'

class GapiStore {
  isLoaded = false
  currentUser: gapi.auth2.GoogleUser | null = null

  constructor() {
    makeAutoObservable(this)
  }
}

export const gapiStore = new GapiStore()
