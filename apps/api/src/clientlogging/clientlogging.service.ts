import { HttpService } from '@nestjs/axios'
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as http from 'http'
import * as https from 'https'
import { hostname } from 'os'

export interface GelfLogEntry {
  short_message: string
  full_message?: string
  _kind: string
  _app: 'frontend-client' | 'backend'
}

@Injectable()
export class ClientLoggingService {
  httpAg: http.Agent
  httpsAg: https.Agent

  constructor(readonly configService: ConfigService, readonly httpService: HttpService) {
    this.httpAg = new http.Agent({
      keepAlive: true,
    })
    this.httpsAg = new https.Agent({
      keepAlive: true,
    })
  }

  async sendLogEntry(entry: GelfLogEntry & Record<string, string>) {
    try {
      const res = await this.httpService
        .post(
          this.configService.get('clientLoggerUrl'),
          {
            ...entry,
            version: '1.1',
            host: hostname(),
          },
          {
            httpAgent: this.httpAg,
            httpsAgent: this.httpsAg,
          }
        )
        .toPromise()
      return res.data
    } catch (e) {
      Logger.warn('Failed to send log to log collector', entry)
      throw new InternalServerErrorException("Can't send log to log collector")
    }
  }
}
