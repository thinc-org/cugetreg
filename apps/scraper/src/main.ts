import { LogLevel, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { Configuration, validateConfig } from '@scraper/config/configuration'
import { ScraperService } from '@scraper/scraper/scraper.service'

import { AppModule } from './app.module'

async function bootstrap() {
  const logLevels: LogLevel[] = ['log', 'error', 'warn']
  if (process.env.LOG_DEBUG === 'true') {
    logLevels.push('debug')
  }
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  })
  const configService = app.get(ConfigService<Configuration>)
  validateConfig(configService)

  const port = configService.get<number>('port')

  await app.listen(port, () => {
    Logger.log(`🚀 App listening on port ${port}`)
  })

  const scraperService = app.get(ScraperService)

  // initial scrape on startup
  scraperService.scrape()
}
bootstrap()
