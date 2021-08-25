import { reaction, runInAction } from 'mobx'

import { collectErrorLog } from '@/services/logging'
import { CourseCartItem, courseCartStore } from '@/store'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { gapiStore } from '@/store/googleApiStore'

const setGState = (s: GDriveSyncState) =>
  runInAction(() => {
    gDriveStore.gDriveState = s
  })

/** Synchronize CourseCartStore */
async function sync(items: CourseCartItem[], isInitialized: boolean) {
  const FILE_ID = 'data.json'
  const APPD_FOLDER = 'appDataFolder'

  // Check for data file
  const fileList = (
    await gapi.client.drive.files.list({
      spaces: APPD_FOLDER,
    })
  ).result.files

  if (!fileList) throw new Error('List of files is not populated. Unknown reason.')

  console.log(`[GDRIVE] FileList: ${JSON.stringify(fileList.map((f) => f.id))}`)

  let fileId: string | null = null

  if (fileList.length == 1) {
    fileId = fileList[0].id || null
  } else if (fileList.length > 1) {
    // Too many files. Unexpected. Erase all
    console.log('[GDRIVE] Too many files. Erasing.') //Probably a bad idea
    collectErrorLog('gdrive contains too many files', fileList)
    await Promise.all(
      fileList.map((f) =>
        gapi.client.drive.files.delete({
          fileId: f.id as string,
        })
      )
    )
  }

  // No existing file, Upload a new file
  console.log('sync with file id', fileId, isInitialized)
  if (!fileId) {
    console.log(`[GDRIVE] User don't have any saved cart, saving ${JSON.stringify(items)}`)
    const metaData = {
      name: FILE_ID,
      parents: [APPD_FOLDER],
      mimeType: 'application/json;charset=UTF-8',
    }
    const req = await gapi.client.request({
      method: 'POST',
      path: '/upload/drive/v3/files',
      params: {
        uploadType: 'multipart',
      },
      headers: {
        'Content-Type': `multipart/related; boundary=bound`,
      },
      body: `--bound\r\nContent-Type: application/json;charset=UTF-8\r\n\r\n${JSON.stringify(
        metaData
      )}\r\n\r\n--bound\r\nContent-Type: application/json;charset=UTF-8\r\n\r\n${JSON.stringify(
        items
      )}\r\n\r\n--bound--`,
    })
    fileId = req.result.id
    if (!fileId) throw new Error("GDrive: Can't create a new file")
  }

  if (!isInitialized) {
    // Cart is not yet restore: syncDirection GDrive => CartStore
    console.log(`[GDRIVE] CartState not initialized, Restoring course cart`)
    const d = await gapi.client.drive.files.get({
      fileId,
      alt: 'media',
    })
    const data = d.result as CourseCartItem[]
    runInAction(() => {
      courseCartStore.isInitialized = true
      courseCartStore.shopItems = data
    })
    console.log(`[GDRIVE] Restored course cart with ${data.length} items`)
  } else {
    // Cart is already resto
    console.log('[GDRIVE] Uploading change')

    await gapi.client.request({
      method: 'PATCH',
      path: `/upload/drive/v3/files/${fileId}`,
      params: {
        uploadType: 'media',
      },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: items,
    })
    console.log(`[GDRIVE] Change uploaded`)
  }
}

/** Lock to prevent concurrent GDrive sync*/
let gDriveSyncLock = false

/** Start reaction watchiing changes in coursecart then sync to GDrive and update sync UI */
export async function startGDriveSync() {
  await gapi.client.load('drive', 'v3')

  const trackedSync = (fn: () => Promise<void>) => {
    if (gDriveSyncLock) return
    gDriveSyncLock = true
    setGState(GDriveSyncState.SYNCING)
    console.log('[GDRIVE] Sync started')
    fn()
      .then(() => {
        console.log('[GDRIVE] Synced')
        setGState(GDriveSyncState.SYNCED)
      })
      .catch((e) => {
        console.error('[GDRIVE] Sync failed', e)
        collectErrorLog('GDrive sync failed', e)
        setGState(GDriveSyncState.SYNCERR)
      })
      .finally(() => {
        gDriveSyncLock = false
      })
  }

  reaction(
    () => ({
      isLoggedIn: gapiStore.currentUser?.isSignedIn(),
      cart: [...courseCartStore.shopItems],
      cartInit: courseCartStore.isInitialized,
    }),
    (d) => {
      if (!d.isLoggedIn) {
        setGState(GDriveSyncState.IDLE)
      } else {
        trackedSync(() => sync(d.cart, d.cartInit))
      }
    },
    { fireImmediately: true, delay: 1000 }
  )
  console.log('[GDRIVE] Store update handler registered')
}

export const GDRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata'

export function grantGdriveSync() {
  const user = gapi.auth2.getAuthInstance().currentUser.get()
  user
    .grant({
      scope: GDRIVE_SCOPE,
    })
    .then(startGDriveSync)
}