import { runInAction } from 'mobx'
import * as uuid from 'uuid'

import { StorageKey } from '@/common/storage/constants'
import { ENABLE_LOGGING } from '@/env'
import { consentStore } from '@/modules/CourseSearch/components/HackConsentForm'
import { httpClient } from '@/services/httpClient'
import { sessionIdStore } from '@/store/sessionIdStore'
import { userStore } from '@/store/userStore'

import { ClientLogDTO, LogEvent } from './types'

function getDeviceId() {
  if (localStorage) {
    const v = localStorage.getItem(StorageKey.DeviceId)
    if (v) {
      return v
    } else {
      const nId = uuid.v4()
      localStorage.setItem(StorageKey.DeviceId, nId)
      return nId
    }
  } else {
    return 'NO-LOCALSTORAGE'
  }
}

export let sessionId = ''
export let deviceId = ''

let backlogLog: ClientLogDTO[] = []

function sendCollectedLog() {
  const data = backlogLog
  backlogLog = []
  if (data.length == 0) return
  if (process.env.NODE_ENV === 'development') return
  if (!consentStore.consent.consentAdditionalV1) return
  httpClient.post(`/clientlogging`, data).catch((e) => console.error('Error while logging', e, 'Message', data))
}

export function startLogging(): () => void {
  if (typeof window == 'undefined') return () => {}

  sessionId = uuid.v4()
  deviceId = getDeviceId()

  console.log('[LOG] Started logging timer DEVID:SESSID', deviceId, sessionId)

  runInAction(() => {
    sessionIdStore.sessionId = sessionId
  })

  const resetTimer = setInterval(() => {
    sendCollectedLog()
  }, 10000)
  return () => {
    window.clearInterval(resetTimer)
  }
}

export function collectLogEvent(event: LogEvent) {
  const log: ClientLogDTO = {
    ...event,
    deviceId: deviceId,
    sessionId: sessionId,
    accessToken: userStore.accessToken || undefined,
  }
  backlogLog.push(log)
  if (backlogLog.length >= 5) sendCollectedLog()
}

export function collectErrorLog(msg: string, err: unknown) {
  let obj = err
  if (obj instanceof Error) {
    obj = {
      message: obj.message,
      stack: obj.stack,
      name: obj.name,
    }
  }
  collectLogEvent({
    kind: 'error',
    message: msg,
    detail: JSON.stringify(obj),
  })
  sendCollectedLog()
}
