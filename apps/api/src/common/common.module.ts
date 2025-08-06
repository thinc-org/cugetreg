import { Module } from '@nestjs/common'

import { DateScalar } from './scalars/date.scalar'
import { DiscordService } from './services/discord.service'
import { OpenAIService } from './services/openai.service'

@Module({
  providers: [DateScalar, OpenAIService, DiscordService],
  exports: [OpenAIService, DiscordService],
})
export class CommonModule {}
