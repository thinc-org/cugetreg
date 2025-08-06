import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'
import { hostname } from 'os'

import { ClientLoggingDocument } from '@cgr/schema'

export interface GelfLogEntry {
  short_message: string
  full_message?: string
  kind: string
  app: 'frontend-client' | 'backend'
}

@Injectable()
export class ClientLoggingService {
  constructor(
    @InjectModel('clientLogging') private readonly clientLoggingModel: Model<ClientLoggingDocument>
  ) {}

  async sendLogEntry(entry: GelfLogEntry & Record<string, string>) {
    try {
      const record = {
        ...entry,
        timestamp: new Date(),
        host: hostname(),
      }

      await this.clientLoggingModel.create(record)
    } catch (e) {
      Logger.error('Failed to send log to logging service', e)
      throw new InternalServerErrorException("Can't send log to log collector")
    }
  }
}
