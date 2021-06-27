import axios from 'axios'

import env from '@/utils/env/macro'

import * as uuid from 'uuid'
import { authStore } from '@/store/meStore'

export interface LogEvent {
  kind: 'track' | 'error'
  message: string
  detail?: string
}

interface ClientLogDto {
  kind: string //Actually arbitary
  message: string
  detail?: string
  accesstoken?: string
  deviceid: string
}

export let sessionId: string | null = null

export function collectLogEvent(event: LogEvent) {
  if (typeof window == 'undefined') return

  if (!sessionId) {
    sessionId = uuid.v4()
    console.log(`[LOG] New session with id ${sessionId}`)
  }

  const log: ClientLogDto = {
    ...event,
    deviceid: sessionId,
    accesstoken: authStore.auth?.accessToken,
  }
  axios
    .post(`${env.backend.uri}/clientlogging`, log)
    .catch((e) => console.error('Error while logging', e, 'Message', log))
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
}
