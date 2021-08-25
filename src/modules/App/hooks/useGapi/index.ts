import { reaction } from 'mobx'
import { useEffect } from 'react'

import { loadGapi } from '@/services/googleAPI'
import { courseCartStore } from '@/store'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { gapiStore } from '@/store/googleApiStore'
import { syncWithLocalStorage } from '@/utils/localstorage'

export default function useGapi() {
  // Retoring AuthStore and Syncing coursecart
  useEffect(() => {
    if (typeof window === 'undefined') return //Don't sync on the server

    reaction(
      () => ({
        isLoggedIn: gapiStore.currentUser?.isSignedIn() && gDriveStore.gDriveState !== GDriveSyncState.NOGRANT,
        cart: [...courseCartStore.shopItems],
        cartInitLocal: courseCartStore.isInitializedLocal,
      }),
      (d) => {
        syncWithLocalStorage(d.cart, d.cartInitLocal, !d.isLoggedIn)
      },
      { fireImmediately: true, delay: 1000 }
    )
  }, [])

  //GAPI hook
  useEffect(() => {
    loadGapi()
  }, [])
}
