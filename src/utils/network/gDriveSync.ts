import { CourseCartItem, courseCartStore } from '@/store'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { meStore } from '@/store/meStore'
import { action, reaction, runInAction } from 'mobx'
import { GetMeResponse, refreshAuthToken } from './auth'

export async function loadGAPI(): Promise<void> {
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
    () => ({ token: meStore.me?.google.accessToken }),
    (s) => {
      if (s.token) {
        console.log('[GAPI] Set token')
        gapi.client.setToken({ access_token: s.token })
      }
    }
  )
  if (meStore.me) gapi.client.setToken({ access_token: meStore.me.google.accessToken })
  console.log('[GAPI] Initialized')
}

const setGState = (s: GDriveSyncState) =>
  runInAction(() => {
    gDriveStore.gDriveState = s
  })

export async function startGDriveSync() {
  async function sync(me: GetMeResponse, items: CourseCartItem[], isInitialized: boolean) {
    const FILE_ID = 'data.json'
    const APPD_FOLDER = 'appDataFolder'

    const listFile = await gapi.client.drive.files.list({
      spaces: APPD_FOLDER,
    })

    if (!listFile.result.files) throw new Error('List of files is not populated. Unknown reason.')

    console.log(`[GDRIVE] FileList: ${JSON.stringify(listFile.result.files.map((f) => f.id))}`)

    if (listFile.result.files.length > 1) {
      console.log('[GDRIVE] Too many files. Erasing.') //Probably a bad idea
      await Promise.all(
        listFile.result.files.map((f) =>
          gapi.client.drive.files.delete({
            fileId: f.id as string,
          })
        )
      )
      listFile.result.files = []
    }

    let fileId

    if (listFile.result.files.length == 0) {
      console.log(`[GDRIVE] User don't havve any saved cart, saving ${JSON.stringify(items)}`)
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
    } else {
      fileId = listFile.result.files[0].id as string
    }

    if (!isInitialized) {
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

  const trackedSync = (fn: Promise<void>) => {
    setGState(GDriveSyncState.SYNCING)
    console.log('[GDRIVE] Sync started')
    fn.then(() => {
      console.log('[GDRIVE] Synced')
      setGState(GDriveSyncState.SYNCED)
    }).catch((e) => {
      console.error('[GDRIVE] Sync failed', e)
      setGState(GDriveSyncState.SYNCERR)
    })
  }

  reaction(
    () => ({ me: meStore.me, cart: courseCartStore.shopItems, cartInit: courseCartStore.isInitialized }),
    (d) => {
      if (!d.me) {
        console.log('[GDRIVE] Ignore. Not logged in')
        setGState(GDriveSyncState.IDLE)
      } else {
        trackedSync(sync(d.me, d.cart, d.cartInit))
      }
    }
  )
  console.log('[GDRIVE] Store update handler registered')
  await refreshAuthToken()
}
