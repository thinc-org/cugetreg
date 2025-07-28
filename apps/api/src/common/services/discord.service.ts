import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { MessageCreateOptions } from 'discord.js'

import { Configuration } from '@api/config/configuration'

@Injectable()
export class DiscordService {
  private webhookUrl: string | null = null

  constructor(private configService: ConfigService<Configuration>) {
    this.webhookUrl = this.configService.get<string>('discordWebhookUrl')
  }

  isAvailable(): boolean {
    return this.webhookUrl !== null && this.webhookUrl.trim() !== ''
  }

  async sendMessage(message: MessageCreateOptions) {
    if (!this.webhookUrl || this.webhookUrl.trim() === '') {
      throw new Error('Discord webhook URL is not configured or is invalid.')
    }

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(
        `Failed to send message to Discord: ${response.statusText} ${await response.text().catch()}`
      )
    }

    return
  }
}
