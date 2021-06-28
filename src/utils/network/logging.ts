import axios from 'axios'

import env from '@/utils/env/macro'

import * as uuid from 'uuid'
import { authStore } from '@/store/meStore'

export interface LogEvent {
  kind: 'track' | 'error' | 'fine-tracking'
  message: string
  detail?: string
  additionalData?: Record<string, string>
}

interface ClientLogDto {
  kind: string
  message: string
  detail?: string
  accessToken?: string
  deviceId: string
  sessionId: string
  additionalData?: Record<string, string>
}

function getDeviceId() {
  if (localStorage) {
    const v = localStorage.getItem(DEVICE_ID_LOCALSTORAGE_KEY)
    if (v) {
      return v
    } else {
      const nId = uuid.v4()
      localStorage.setItem(DEVICE_ID_LOCALSTORAGE_KEY, nId)
      return nId
    }
  } else {
    return 'NO-LOCALSTORAGE'
  }
}

export let sessionId = ''
export let deviceId = ''

const DEVICE_ID_LOCALSTORAGE_KEY = 'DEVICE_ID'

let backlogLog: ClientLogDto[] = []

function sendCollectedLog() {
  const data = backlogLog
  backlogLog = []
  if (data.length == 0) return
  axios
    .post(`${env.backend.uri}/clientlogging`, data)
    .catch((e) => console.error('Error while logging', e, 'Message', data))
}

export function startLogging(): () => void {
  if (typeof window == 'undefined') return () => {}

  sessionId = uuid.v4()
  deviceId = getDeviceId()

  console.log('[LOG] Started logging timer DEVID:SESSID', deviceId, sessionId)
  const resetTimer = setInterval(() => {
    sendCollectedLog()
  }, 10000)
  return () => {
    window.clearInterval(resetTimer)
  }
}

export function collectLogEvent(event: LogEvent) {
  const log: ClientLogDto = {
    ...event,
    deviceId: deviceId,
    sessionId: sessionId,
    accessToken: authStore.auth?.accessToken,
  }
  backlogLog.push(log)
  if (backlogLog.length >= 5) sendCollectedLog()
}

export function collectErrorLog(msg: string, err: any) {
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
