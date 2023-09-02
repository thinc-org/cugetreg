import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'

import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch'
import { hostname } from 'os'

export interface GelfLogEntry {
  short_message: string
  full_message?: string
  kind: string
  app: 'frontend-client' | 'backend'
}

const CLIENTLOGGING_INDEX = 'cgr-clientlogging'

@Injectable()
export class ClientLoggingService {
  constructor(
    @InjectOpensearchClient('default') private readonly opensearchClient: OpensearchClient
  ) {}

  async sendLogEntry(entry: GelfLogEntry & Record<string, string>) {
    try {
      const record = {
        ...entry,
        timestamp: new Date(),
        host: hostname(),
      }

      await this.opensearchClient.index({
        index: CLIENTLOGGING_INDEX,
        body: record,
        refresh: true,
      })
    } catch (e) {
      Logger.error('Failed to send log to logging service', e)
      throw new InternalServerErrorException("Can't send log to log collector")
    }
  }
}
