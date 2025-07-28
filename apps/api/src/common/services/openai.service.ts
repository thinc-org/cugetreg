import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import OpenAI from 'openai'

import { Configuration } from '@api/config/configuration'

@Injectable()
export class OpenAIService {
  private logger: Logger = new Logger('OpenAIService')
  private openai: OpenAI | null = null

  constructor(private configService: ConfigService<Configuration>) {
    const apiKey = this.configService.get<string>('openaiApiKey')

    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
      })
      this.logger.log('OpenAI service initialized')
    } else {
      this.logger.warn('OpenAI API key not provided. OpenAI service will be disabled.')
    }
  }

  /**
   * Moderates content using OpenAI moderation API
   * @param content Content to check with OpenAI moderation API
   * @returns `true` if content is flagged, `false` if not, or `null` if moderation fails
   */
  async moderateContent(content: string): Promise<boolean | null> {
    if (!this.openai) {
      this.logger.warn('OpenAI service not initialized. Skipping content moderation.')
      return null
    }

    try {
      const response = await this.openai.moderations.create({
        input: content,
      })

      const result = response.results[0]
      return result.flagged
    } catch (error) {
      this.logger.error(
        'Error moderating content with OpenAI:',
        error instanceof Error ? error.message : 'Unknown error'
      )

      return null
    }
  }

  isAvailable(): boolean {
    return this.openai !== null
  }
}
