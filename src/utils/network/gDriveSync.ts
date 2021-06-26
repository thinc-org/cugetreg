import { CourseCartItem, courseCartStore } from '@/store'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { authStore, AuthStore } from '@/store/meStore'
import { reaction, runInAction } from 'mobx'

/** Lock to prevent GAPI from loading multiple time */
let isGapiInit = false

/** Load Google API Client and setup token */
export async function loadGAPI(): Promise<void> {
  if (isGapiInit) return
  isGapiInit = true
  await new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('Not a browser')
    const s = document.createElement('script')
    s.src = 'https://apis.google.com/js/api.js'
    s.onload = () => resolve('')
    s.onerror = () => reject('Script load failure')
    s.defer = true
    s.async = true
    document.body.appendChild(s)
  })
  await new Promise((resolve, _) => gapi.load('client:auth2', resolve))
  await gapi.client.load('drive', 'v3')
  await gapi.client.init({})

  reaction(
    () => authStore.me?.google.accessToken,
    (gapiToken) => {
      if (gapiToken) {
        console.log('[GAPI] Setting new token')
        gapi.client.setToken({ access_token: gapiToken })
      }
    },
    { fireImmediately: true }
  )
  console.log('[GAPI] Initialized')
}

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
    await Promise.all(
      fileList.map((f) =>
        gapi.client.drive.files.delete({
          fileId: f.id as string,
        })
      )
    )
  }

  // No existing file, Upload a new file
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
        setGState(GDriveSyncState.SYNCERR)
      })
      .finally(() => {
        gDriveSyncLock = false
      })
  }

  reaction(
    () => ({
      isLoggedIn: authStore.isLoggedIn,
      cart: [...courseCartStore.shopItems],
      cartInit: courseCartStore.isInitialized,
    }),
    (d) => {
      if (!d.isLoggedIn) {
        console.log('[GDRIVE] Ignore. Not logged in')
        setGState(GDriveSyncState.IDLE)
      } else {
        trackedSync(() => sync(d.cart, d.cartInit))
      }
    },
    { fireImmediately: true, delay: 1000 }
  )
  console.log('[GDRIVE] Store update handler registered')
}
