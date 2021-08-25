import { runInAction } from 'mobx'

import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { gapiStore } from '@/store/googleApiStore'
import { googleauth_clientid } from '@/utils/env'
import { GDRIVE_SCOPE, startGDriveSync } from '@/utils/network/gDriveSync'

export default function loadGapi() {
  if (typeof window === 'undefined') return
  ;(window as any).onGapiLoad = () => {
    handleGapiLoad()
  }

  const script = document.createElement('script')
  script.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad'
  script.async = true
  document.body.appendChild(script)
}

async function handleGapiLoad() {
  console.log('[GAPI] Google API is loaded')
  await new Promise((resolve) => {
    gapi.load('client:auth2', resolve)
  })

  await gapi.client.init({
    clientId: googleauth_clientid,
    scope: 'profile email https://www.googleapis.com/auth/drive.appdata',
    hosted_domain: 'student.chula.ac.th',
  })

  gapi.auth2.getAuthInstance().then((auth) => setupUserAuth(auth))
}

async function setupUserAuth(auth: gapi.auth2.GoogleAuth) {
  gapiStore.currentUser = auth.currentUser.get().isSignedIn() ? auth.currentUser.get() : null
  console.log('[GAPI] Current user login: ', gapiStore.currentUser?.getId())
  gapiStore.isLoaded = true
  if (gapiStore.currentUser) postUserDeterminedHandler(gapiStore.currentUser)
}

function postUserDeterminedHandler(user: gapi.auth2.GoogleUser) {
  if (user.isSignedIn()) {
    if (user.hasGrantedScopes(GDRIVE_SCOPE)) {
      startGDriveSync()
    } else {
      runInAction(() => (gDriveStore.gDriveState = GDriveSyncState.NOGRANT))
    }
  }
}

export async function login() {
  const auth = gapi.auth2.getAuthInstance()
  const user = await auth.signIn()
  console.log('[GAPI] New user singed in : ', user.getId())
  gapiStore.currentUser = user
  postUserDeterminedHandler(user)
}

export async function logout() {
  const auth = gapi.auth2.getAuthInstance()
  await auth.signOut()
  gapiStore.currentUser = null
  console.log('[GAPI] User logged out')
}
