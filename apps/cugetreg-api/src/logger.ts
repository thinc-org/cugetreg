import { ConsoleLogger } from '@nestjs/common'

import { Axios } from 'axios'
import { Agent as HttpAgent } from 'http'
import { Agent as HttpsAgent } from 'https'
import { hostname } from 'os'

export class GelfLogger extends ConsoleLogger {
  private gelfAgent: Axios
  constructor() {
    super()
    this.gelfAgent = new Axios({
      httpAgent: new HttpAgent({
        keepAlive: true,
      }),
      httpsAgent: new HttpsAgent({
        keepAlive: true,
      }),
    })
  }

  private logEntry(shortMessage: string, level: number, additionalParam: [...any, string?]) {
    let context = this.context
    if (
      additionalParam.length > 0 &&
      typeof additionalParam[additionalParam.length - 1] === 'string'
    ) {
      context = additionalParam.pop()
    }
    const entry = {
      version: '1.1',
      host: hostname(),
      short_message: shortMessage,
      full_message: JSON.stringify(additionalParam),
      level: level,
      _context: context,
      _app: 'backend',
      _kind: 'logger',
    }
    this.gelfAgent
      .request({
        method: 'POST',
        data: JSON.stringify(entry),
        url: process.env.CLIENT_LOGGER_URL,
      })
      .catch((e) => {
        if (process.env.IS_PRODUCTION === 'true') console.error('GELF not available', e)
      })
  }

  log(message: string, ...additionalParams: any[]) {
    this.logEntry(message, 6, additionalParams)
    super.log.apply(this, [message, ...additionalParams])
  }

  warn(message: string, ...additionalParams: any[]) {
    this.logEntry(message, 4, additionalParams)
    super.warn.apply(this, [message, ...additionalParams])
  }

  error(message: string, ...additionalParams: any[]) {
    this.logEntry(message, 3, [message, ...additionalParams])
    super.error.apply(this, [message, ...additionalParams])
  }
}
