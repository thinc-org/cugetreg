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
  accessToken?: string
  deviceId: string
}

export const sessionId = uuid.v4()

export function collectLogEvent(event: LogEvent) {
  if (typeof window == 'undefined') return

  const log: ClientLogDto = {
    ...event,
    deviceId: sessionId,
    accessToken: authStore.auth?.accessToken,
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
